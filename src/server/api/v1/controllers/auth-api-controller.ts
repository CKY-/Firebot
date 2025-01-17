
import logger from '../../../../backend/logwrapper';
import authManager from '../../../../backend/auth/auth-manager';
import { Request, Response } from "express";
import { AuthProvider, AuthProviderDefinition } from "../../../../backend/auth/auth";
import ClientOAuth2 from "client-oauth2";

export function getAuth(req: Request, res: Response) {
    const providerId = req.query.providerId;
    const provider: AuthProvider = typeof providerId === "string" ? authManager.getAuthProvider(providerId) : null;

    if (provider == null) {
        return res.status(400).json({
            status: "error",
            message: "Invalid providerId query param"
        });
    }

    logger.info(`Redirecting to provider auth uri: ${provider.authorizationUri}`);

    res.redirect(provider.authorizationUri);
}

export async function getAuthCallback(req: Request, res: Response) {
    const state: string = typeof req.query.state === "string" ? req.query.state : null;
    const provider: AuthProvider = authManager.getAuthProvider(state);

    if (provider == null) {
        return res.status(400).json({
            status: "error",
            message: "Invalid provider id in state"
        });
    }

    try {
        const fullUrl: string = req.originalUrl.replace("callback2", "callback");
        let token: ClientOAuth2.Token;

        const authType: AuthProviderDefinition["auth"]["type"] = provider.details.auth.type ?? "code";

        const tokenOptions: ClientOAuth2.Options = { body: {} };

        switch (authType) {
            case "token":
                token = await provider.oauthClient.token.getToken(fullUrl, tokenOptions);
                break;

            case "code":
                // Force these because the library adds them as an auth header, not in the body
                tokenOptions.body["client_id"] = provider.details.client.id;
                tokenOptions.body["client_secret"] = provider.details.client.secret;

                token = await provider.oauthClient.code.getToken(fullUrl, tokenOptions);
                break;

            default:
                break;
        }

        logger.info(`Received token from provider id '${provider.id}'`);

        const newTokenData = {
            ...token.data,
            scope: token.data.scope.split(" ")
        };

        authManager.successfulAuth(provider.id, newTokenData);

        return res.redirect(`/loginsuccess?provider=${encodeURIComponent(provider.details.name)}`);
    } catch (error) {
        logger.error('Access Token Error', error.message);
        return res.status(500).json({
            status: "error",
            message: "Authentication failed"
        });
    }
}
