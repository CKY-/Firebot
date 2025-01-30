import { Router, Request, Response, NextFunction } from "express";
const router = Router();//eslint-disable-line new-cap
import logger from "../../../backend/logwrapper";

router.use(function log(req: Request, res: Response, next: NextFunction) {
    // here we could do stuff for every request if we wanted
    logger.debug(`API Request from: ${req.socket.remoteAddress}, for path: ${req.originalUrl}`);
    next();
});

// Auth
import * as auth from "./controllers/auth-api-controller";

/**
 * @openapi
 * /auth:
 *   parameters:
 *     - in: query
 *       name: providerId
 *       description: The ID of the provider.
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - auth
 *     description: Redirects the user to the authorization URI of the specified authentication provider. (e.g., Google OAuth2 authorization page).
 *     responses:
 *       200:
 *         description: Auth details returned successfully.
 *       400:
 *         description: Invalid providerId query param.
 */
router.route("/auth")
    .get(auth.getAuth);

/**
 * @openapi
 * /auth/callback2:
 *   parameters:
 *     - in: query
 *       name: state
 *       description: The state passed in the initial authentication request, used to identify the provider..
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - auth
 *     description: Callback endpoint for authentication providers after user authorization. It exchanges the authorization code or token for an access token.
 *     responses:
 *       200:
 *         description: Authentication callback handled.
 *       400:
 *         description: Invalid provider id in state.
 *       500:
 *         description: Authentication failed.
 */
router.route("/auth/callback2")
    .get(auth.getAuthCallback);

/**
 * @openapi
 * /auth/tokencallback:
 *   get:
 *     tags:
 *       - auth
 *     description: Handles token callback from the authentication provider.
 *     responses:
 *       200:
 *         description: Token callback handled.
 *       400:
 *         description: Invalid provider id in state.
 *       500:
 *         description: Authentication failed.
 */
router.route("/auth/tokencallback")
    .get(auth.getAuthCallback);

// Status
import * as status from "./controllers/status-api-controller";

/**
 * @openapi
 * /status:
 *   get:
 *     tags:
 *       - status
 *     description: Fetches the current status of Firebots connections, specifically the chat connection status.
 *     responses:
 *       200:
 *         description: Status returned successfully.
 *         content:
 *           application/json:
 *             example:
 *               connections:
 *                 chat: true
 */
router.route("/status")
    .get(status.getStatus);

// Effects
import * as effects from "./controllers/effects-api-controller";

/**
 * @openapi
 * /effects:
 *   get:
 *     tags:
 *      - effects
 *     description: Fetches all effects.
 *     responses:
 *       200:
 *         description: Effects fetched or executed.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - id: firebot:activeUserLists
 *                 name: Manage Active Chat Users
 *                 description: Add or remove users from the active chat user lists.
 *                 icon: fad fa-users
 *                 categories:
 *                   - common
 *                   - twitch
 *                   - chat based
 *                   - Moderation
 *                   - overlay
 *                   - fun
 *                   - integrations
 *                   - advanced
 *                   - scripting
 *                 dependencies:
 *                   - chat
 *                   - overlay
 *               - ...
 *   post:
 *     description: Executes an effect.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "streamerName"
 *               triggerData:
 *                 type: object
 *                 properties:
 *                   metadata:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: "streamerName"
 *                       eventData:
 *                         type: object
 *                         properties:
 *                           shared:
 *                             type: boolean
 *                             example: true
 *                           totalMonths:
 *                             type: integer
 *                             example: 6
 *                       control:
 *                         type: object
 *                         properties:
 *                           cost:
 *                             type: integer
 *                             example: 10
 *                           text:
 *                             type: string
 *                             example: "Test Button"
 *                           cooldown:
 *                             type: string
 *                             example: "30"
 *                           disabled:
 *                             type: boolean
 *                             example: false
 *                           progress:
 *                             type: number
 *                             format: float
 *                             example: 0.5
 *                           tooltip:
 *                             type: string
 *                             example: "Test tooltip"
 *                       inputData:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: string
 *                             example: "@Textbox"
 *                       command:
 *                         type: object
 *                         properties:
 *                           commandID:
 *                             type: string
 *                             example: "Test Command"
 *                   userCommand:
 *                     type: object
 *                     properties:
 *                       cmd:
 *                         type: string
 *                         example: "!test"
 *                       value:
 *                         type: string
 *                         example: "!test"
 *                   args:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "@TestArg1"
 *                       - "TestArg2"
 *                       - "@TestArg3"
 *                       - "TestArg4"
 *                       - "@TestArg5"
 *                   chatEvent:
 *                     type: object
 *                     additionalProperties: true
 *                     example: {}
 *     responses:
 *       200:
 *         description: Effects fetched or executed.
 *       400:
 *         description: No effects provided.
 *       500:
 *         description: Error response.
 */
router.route("/effects")
    .get(effects.getEffects)
    .post(effects.runEffects);

/**
 * @openapi
 * /effects/preset:
 *   parameters:
 *     - in: query
 *       name: trigger
 *       description: The ID of the effect.
 *       schema:
 *         type: string
 *   get:
 *     description: Fetches all preset lists.
 *     responses:
 *       200:
 *         description: Preset lists returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               - id: 90e944d0-a276-11ec-a033-a9c16dcd8877
 *                 name: StartStream
 *                 args:
 *                   - lightsOn
 *               - "..."
 *       500:
 *         description: Unknown error getting preset effect lists.
 */
router.route("/effects/preset")
    .get(effects.getPresetLists);

/**
 * @openapi
 * /effects/{effectId}:
 *   parameters:
 *     - in: path
 *       name: effectId
 *       required: true
 *       description: The ID of the effect.
 *       schema:
 *         type: string
 *         format: namespace:effect
 *   get:
 *     description: Fetches a specific effect by its ID.
 *     responses:
 *       200:
 *         description: Effect fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: firebot:activeUserLists
 *                 name: Manage Active Chat Users
 *                 description: Add or remove users from the active chat user lists.
 *                 icon: fad fa-users
 *                 categories:
 *                   - common
 *                   - twitch
 *                   - chat based
 *                   - Moderation
 *                   - overlay
 *                   - fun
 *                   - integrations
 *                   - advanced
 *                   - scripting
 *                 dependencies:
 *                   - chat
 *                   - overlay
 *       404:
 *         description: Cannot find effect effectId.
 */
router.route("/effects/:effectId")
    .get(effects.getEffect);

/**
 * @openapi
 * /effects/preset/{presetListId}:
 *   parameters:
 *     - in: path
 *       name: presetListId
 *       required: true
 *       description: The ID of the effect.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Runs a preset list synchronously.
 *     responses:
 *       200:
 *         description: Effects fetched or executed.
 *       400:
 *         description: No presetListId provided.
 *       404:
 *         description: Cannot find preset effect list presetList.
 *       500:
 *         description: Error response.
 *   post:
 *     description: Runs a preset list synchronously.
 *     requestBody:
 *       content:
 *         "application/json":
 *           schema:
 *             properties:
 *               args:
 *                 description: The argument object in json format
 *                 type: object
 *               username:
 *                 description: The triggering user by name
 *                 type: string
 *           examples:
 *             streamer:
 *               value:
 *                 args:
 *                    data: 2
 *                    funWords: string of strings
 *                 username: ebiggz
 *             viewer:
 *               value:
 *                 args:
 *                    data: 2
 *                    funWords: string of strings
 *                 username: heyaapl
 *     responses:
 *       200:
 *         description: Effects fetched or executed.
 *       400:
 *         description: No presetListId provided.
 *       404:
 *         description: Cannot find preset effect list presetList.
 *       500:
 *         description: Error response.
 */
router.route("/effects/preset/:presetListId")
    .get(effects.runPresetListSynchronous)
    .post(effects.runPresetListSynchronous);

/**
 * @openapi
 * /effects/preset/{presetListId}/run:
 *   parameters:
 *     - in: path
 *       name: presetListId
 *       required: true
 *       description: The ID of the effect.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Triggers a preset list asynchronously.
 *     responses:
 *       200:
 *         description: Effects fetched or executed.
 *       400:
 *         description: No presetListId provided.
 *       404:
 *         description: Cannot find preset effect list presetList.
 *       500:
 *         description: Error response.
 *   post:
 *     description: Triggers a preset list asynchronously.
 *     requestBody:
 *       content:
 *         "application/json":
 *           schema:
 *             properties:
 *               args:
 *                 description: The argument object in json format
 *                 type: object
 *               username:
 *                 description: The triggering user by name
 *                 type: string
 *           examples:
 *             streamer:
 *               value:
 *                 args:
 *                    data: 2
 *                    funWords: string of strings
 *                 username: ebiggz
 *             viewer:
 *               value:
 *                 args:
 *                    data: 2
 *                    funWords: string of strings
 *                 username: heyaapl
 *     responses:
 *       200:
 *         description: Effects fetched or executed.
 *       400:
 *         description: No presetListId provided.
 *       404:
 *         description: Cannot find preset effect list presetList.
 *       500:
 *         description: Error response.
 */
router.route("/effects/preset/:presetListId/run")
    .get(effects.triggerPresetListAsync)
    .post(effects.triggerPresetListAsync);

// Commands
import * as commands from "./controllers/commands-api-controller";

/**
 * @openapi
 * /commands/system:
 *   get:
 *     description: Fetches all system commands.
 *     responses:
 *       200:
 *         description: System commands fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *               example:
 *                 - id: firebot:commandlist
 *                   trigger: "!commands"
 *                   name: Command List.
 *                 - ...
 *       500:
 *         description: Unknown error getting system commands.
 */
router.route("/commands/system")
    .get(commands.getSystemCommands);

/**
 * @openapi
 * /commands/system/{sysCommandId}:
 *   parameters:
 *     - in: path
 *       name: sysCommandId
 *       required: true
 *       description: The ID of the system command.
 *       schema:
 *         type: string
 *         format: namespace:type
 *   get:
 *     description: Fetches a specific system command by its ID.
 *     responses:
 *       200:
 *         description: System command fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               - id: firebot:commandlist
 *                 name: Command List
 *                 active: true
 *                 trigger: "!commands"
 *                 description:
 *                   Displays a link to your profile page with all available
 *                   commands.
 *                 autoDeleteTrigger: false
 *                 scanWholeMessage: false
 *                 cooldown:
 *                   user: 0
 *                   global: 0
 *                 options:
 *                   successTemplate:
 *                     type: string
 *                     title: Output Template
 *                     description:
 *                       The chat message to send with a link to your profile
 *                       page.
 *                     tip: "Variables: {url}"
 *                     default: "You can view the list of commands here: {url}"
 *                     useTextArea: true
 *                   noCommandsTemplate:
 *                     type: string
 *                     title: No Commands Output Template
 *                     description:
 *                       The chat message to send when a user has no commands
 *                       they are allowed to run.
 *                     tip: "Variables: {username}"
 *                     default:
 *                       "{username}, there are no commands that you are allowed
 *                       to run."
 *                     useTextArea: true
 *                 type: system
 *       400:
 *         description: No sysCommandId provided.
 *       404:
 *         description: System command sysCommandId not found.
 */
router.route("/commands/system/:sysCommandId")
    .get(commands.getSystemCommand);

/**
 * @openapi
 * /commands/system/{sysCommandId}/run:
 *   parameters:
 *     - in: path
 *       name: sysCommandId
 *       required: true
 *       description: The ID of the effect.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Executes a system command.
 *     responses:
 *       200:
 *         description: System command executed successfully.
 *       400:
 *         description: No sysCommandId provided.
 *       404:
 *         description: System command sysCommandId not found.
 *       500:
 *         description: Error executing system command sysCommandId.
 *   post:
 *     description: Executes a system command.
 *     responses:
 *       200:
 *         description: System command executed successfully.
 *       400:
 *         description: No sysCommandId provided.
 *       404:
 *         description: System command sysCommandId not found.
 *       500:
 *         description: Error executing system command sysCommandId.
 */
router.route("/commands/system/:sysCommandId/run")
    .get(commands.runSystemCommand)
    .post(commands.runSystemCommand);

/**
 * @openapi
 * /commands/custom:
 *   get:
 *     description: Fetches all custom commands.
 *     responses:
 *       200:
 *         description: Custom commands fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - id: e7cf0470-cec3-11ea-9a2c-c96e412d3e47
 *                 trigger: "!bot"
 *                 description: See if the bot is active.
 *               - "..."
 *       500:
 *         description: Unknown error getting system commands.
 */
router.route("/commands/custom")
    .get(commands.getCustomCommands);

/**
 * @openapi
 * /commands/custom/{customCommandId}:
 *   parameters:
 *     - in: path
 *       name: customCommandId
 *       required: true
 *       description: The ID of the custom command.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Fetches a specific custom command by its ID.
 *     responses:
 *       200:
 *         description: Custom command fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               - active: true
 *                 cooldown:
 *                   user: 0
 *                   global: 300
 *                 effects:
 *                   list:
 *                     - id: 41b5ec30-5726-11ef-bc52-4f77de7382a8
 *                       type: firebot:chat
 *                       chatter: Bot
 *                       message: im not a bot im a boy i have been called a bot $count times
 *                       active: true
 *                       me: true
 *                       percentWeight:
 *                   id: d80aea40-cec3-11ea-9a2c-c96e412d3e47
 *                   queue:
 *                 ignoreBot: true
 *                 restrictionData:
 *                   restrictions:
 *                     - id: 40f2c420-2776-11ee-befb-576ea2e18d8c
 *                       type: firebot:followcheck
 *                       value: SReject
 *                       checkMode: streamer
 *                   mode: all
 *                   sendFailMessage: true
 *                   failMessage: "Sorry, you cannot use this command because: {reason}"
 *                 sortTags: []
 *                 trigger: "!bot"
 *                 id: e7cf0470-cec3-11ea-9a2c-c96e412d3e47
 *                 createdBy: sreject
 *                 createdAt: "2020-07-25T16:12:19-06:00"
 *                 count: 194
 *                 lastEditBy: sreject
 *                 lastEditAt: "2025-01-15T12:39:20.895-07:00"
 *                 simple: false
 *                 sendCooldownMessage: true
 *                 cooldownMessage: "This command is still on cooldown for: {timeLeft}"
 *                 aliases: []
 *                 description: See if the bot is active.
 *                 treatQuotedTextAsSingleArg: false
 *                 type: custom
 *                 hidden: true
 *                 scanWholeMessage: true
 *                 allowTriggerBySharedChat: true
 *       400:
 *         description: No customCommandId provided.
 *       404:
 *         description: Custom command customCommandId not found.
 */
router.route("/commands/custom/:customCommandId")
    .get(commands.getCustomCommand);

/**
 * @openapi
 * /commands/custom/{customCommandId}/run:
 *   parameters:
 *     - in: path
 *       name: customCommandId
 *       required: true
 *       description: The ID of the effect.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Executes a custom command.
 *     responses:
 *       200:
 *         description: Custom command executed successfully.
 *       400:
 *         description: No customCommandId provided.
 *       404:
 *         description: System command customCommandId not found.
 *       500:
 *         description: Error executing system command customCommandId.
 *   post:
 *     description: Executes a custom command.
 *     responses:
 *       200:
 *         description: Custom command executed successfully.
 *       400:
 *         description: No customCommandId provided.
 *       404:
 *         description: System command customCommandId not found.
 *       500:
 *         description: Error executing system command customCommandId.
 */
router.route("/commands/custom/:customCommandId/run")
    .get(commands.runCustomCommand)
    .post(commands.runCustomCommand);

// Fonts
import * as fonts from "./controllers/fonts-api-controller";

/**
 * @openapi
 * /fonts:
 *   get:
 *     description: Fetches all font names.
 *     responses:
 *       200:
 *         description: Font names returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - name: Arial
 *                 format: truetype
 *               - ...
 */
router.route("/fonts")
    .get(fonts.getFontNames);

/**
 * @openapi
 * /fonts/{name}:
 *   parameters:
 *     - in: path
 *       name: name
 *       required: true
 *       description: The name of the font.
 *       schema:
 *         type: string
 *   get:
 *     description: Fetches a specific font by name.
 *     responses:
 *       200:
 *         description: Font fetched successfully.
 *       404:
 *         description: Font not found.
 */
router.route("/fonts/:name")
    .get(fonts.getFont);

// Custom Variables
import * as customVariables from "./controllers/custom-variable-api-controller";

/**
 * @openapi
 * /custom-variables:
 *   get:
 *     description: Fetches all custom variables.
 *     responses:
 *       200:
 *         description: Custom variables fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               testVar1:
 *                 t: 0
 *                 v: 1
 *               MicMuteState:
 *                 t: 0
 *                 v: false
 *               modsCreditsSet:
 *                 t: 0
 *                 v: 1
 */
router.route("/custom-variables")
    .get(customVariables.getCustomVariables);

/**
 * @openapi
 * /custom-variables/{variableName}:
 *   parameters:
 *     - in: path
 *       name: variableName
 *       required: true
 *       description: The name of the custom variable.
 *       schema:
 *         $ref: "#/components/schemas/UUIDString"
 *   get:
 *     description: Fetches a specific custom variable by name.
 *     responses:
 *       200:
 *         description: Custom variable fetched successfully.
 *   post:
 *     description: Sets the value of a custom variable.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               data:
 *                 description: The data to store.
 *                 type: string
 *                 example: data to store in the variable
 *               ttl:
 *                 description: The time-to-live durration.
 *                 type: string
 *                 example: 0
 *     responses:
 *       201:
 *         description: Custom variable set successfully.
 */
router.route("/custom-variables/:variableName")
    .get(customVariables.getCustomVariable)
    .post(customVariables.setCustomVariable);

// Built-in Variables
import * as variableManager from "./controllers/variable-api-controller";

/**
 * @openapi
 * /variables:
 *   get:
 *     description: Fetches all replace variables.
 *     responses:
 *       200:
 *         description: Replace variables fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - definition:
 *                   handle: "&name"
 *                   usage: "&name[...path?]"
 *                   description: "Retrieves the value for an effectOutput. If path is specified, walks the item before returning the value"
 *                   examples:
 *                     - usage: "&example"
 *                       description: "Returns the value of the effectOutput 'example'; Synonymous with $effectOutput[example]"
 *                     - usage: "&example[path, to, value]"
 *                       description: "Returns the value of the effectOutput 'example'; Synonymous with $effectOutput[example, path.to.value]"
 *                   categories:
 *                     - "advanced"
 *                   possibleDataOutput:
 *                     - "ALL"
 *                   spoof: true
 *                 handle: "&name"
 *               - "..."
 */
router.route("/variables")
    .get(variableManager.getReplaceVariables);

// Viewers
import * as viewers from "./controllers/viewers-api-controller";

/**
 * @openapi
 * /viewers:
 *   get:
 *     description: Fetches all viewers.
 *     responses:
 *       200:
 *         description: Viewer data returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - id: "58612601"
 *                 username: ebiggz
 *                 displayName: ebiggz
 *               - ...
 */
router.route("/viewers")
    .get(viewers.getAllUsers);

/**
 * @openapi
 * /viewers/export:
 *   get:
 *     description: Exports all user data as JSON.
 *     responses:
 *       200:
 *         description: Viewer data exported as JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - username: ebiggz
 *                 _id: "58612601"
 *                 displayName: ebiggz
 *                 profilePicUrl: https://static-cdn.jtvnw.net/jtv_user_pictures/5545fe76-a341-4ffb-bc79-7ca8075588a1-profile_image-300x300.png
 *                 twitch: true
 *                 twitchRoles:
 *                   - broadcaster
 *                   - sub
 *                 online: false
 *                 onlineAt: 1733422513344
 *                 lastSeen: 1733425628339
 *                 joinDate: 1677340192238
 *                 minutesInChannel: 2908
 *                 chatMessages: 595
 *                 disableAutoStatAccrual: false
 *                 disableActiveUserList: false
 *                 disableViewerList: false
 *                 metadata:
 *                   giftedSubs: 4
 *                 currency:
 *                   d073da00-a726-11e9-a874-7de9c8544807:
 *                     id: d073da00-a726-11e9-a874-7de9c8544807
 *                     name: Points
 *                     amount: 3479
 *                 ranks:
 *                   4e834bc0-47a8-11ef-acab-ab8744fe0dbe: 5b149d83-3021-4afd-875d-034b00a4a91b
 *               - ...
 */
router.route("/viewers/export")
    .get(viewers.getAllUserDataAsJSON);

/**
 * @openapi
 * /viewers/{userId}:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *     - in: query
 *       name: username
 *       description: use username or userId true/false (default false).
 *       schema:
 *         type: string
 *   get:
 *     description: Fetches metadata of a specific viewer by userId.
 *     responses:
 *       200:
 *         description: Viewer metadata fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               username: ebiggz
 *               _id: "58612601"
 *               displayName: ebiggz
 *               profilePicUrl: https://static-cdn.jtvnw.net/jtv_user_pictures/5545fe76-a341-4ffb-bc79-7ca8075588a1-profile_image-300x300.png
 *               twitch: true
 *               twitchRoles:
 *                 - broadcaster
 *                 - sub
 *               online: false
 *               onlineAt: 1733422513344
 *               lastSeen: 1733425628339
 *               joinDate: 1677340192238
 *               minutesInChannel: 2908
 *               chatMessages: 595
 *               disableAutoStatAccrual: false
 *               disableActiveUserList: false
 *               disableViewerList: false
 *               metadata:
 *                 giftedSubs: 4
 *               currency:
 *                 d073da00-a726-11e9-a874-7de9c8544807: 3479
 *                 3eba5d80-4297-11ee-86eb-d7d7d2938882: 3445
 *               ranks:
 *                 4e834bc0-47a8-11ef-acab-ab8744fe0dbe: 5b149d83-3021-4afd-875d-034b00a4a91b
 *               customRoles:
 *                 - id: 6f3b78b0-025c-11ef-bcad-3ff3fa1199ea
 *                   name: firebot
 *       400:
 *         description: No viewerIdOrName provided.
 *       404:
 *         description: Specified viewer does not exist.
 */
router.route("/viewers/:userId")
    .get(viewers.getUserMetadata);

/**
 * @openapi
 * /viewers/{userId}/metadata/{metadataKey}:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *     - in: path
 *       name: metadataKey
 *       required: true
 *       description: The key of the metadata to be modified or deleted.
 *       schema:
 *         type: string
 *     - in: query
 *       name: username
 *       description: use username or userId true/false (default false).
 *       schema:
 *         type: string
 *   post:
 *     description: Updates metadata for a specific viewer.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               data:
 *                 description: The data to store in metadata.
 *                 type: string
 *                 example: data to store in metadata
 *     responses:
 *       201:
 *         description: Metadata added successfully.
 *       204:
 *         description: Metadata added successfully.
 *       400:
 *         description: No viewerIdOrName provided.
 *       404:
 *         description: Specified viewer does not exist.
 *   put:
 *     description: Updates metadata for a specific viewer.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               data:
 *                 description: The data to store.
 *                 type: string
 *     responses:
 *       201:
 *         description: Metadata updated successfully.
 *       204:
 *         description: Metadata updated successfully.
 *       400:
 *         description: No viewerIdOrName provided.
 *       404:
 *         description: Specified viewer does not exist.
 *   delete:
 *     description: Removes metadata for a specific viewer.
 *     responses:
 *       204:
 *         description: Metadata removed successfully.
 *       400:
 *         description: No viewerIdOrName provided.
 *         content:
 *           application/json:
 *             examples:
 *               NoMetadataKey:
 *                 summary: No metadataKey provided.
 *                 value:
 *                   status: error
 *                   message: No metadataKey provided.
 *               NoViewer:
 *                 summary: No viewerId provided.
 *                 value:
 *                   status: error
 *                   message: No viewerId provided.
 *       404:
 *         description: Specified viewer does not exist.
 *         content:
 *           application/json:
 *             examples:
 *               NoMetadataKey:
 *                 summary: No metadataKey provided.
 *                 value:
 *                   status: error
 *                   message: No metadataKey provided.
 *               NoViewer:
 *                 summary: No viewerId provided.
 *                 value:
 *                   status: error
 *                   message: No viewerId provided.
 */
router.route("/viewers/:userId/metadata/:metadataKey")
    .post(viewers.updateUserMetadataKey)
    .put(viewers.updateUserMetadataKey)
    .delete(viewers.removeUserMetadataKey);

/**
 * @openapi
 * /viewers/{userId}/currency:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *     - in: query
 *       name: username
 *       description: use username or userId true/false (default false).
 *       schema:
 *         type: string
 *   get:
 *     description: Fetches currency details for a specific viewer.
 *     responses:
 *       200:
 *         description: User currency fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               d073da00-a726-11e9-a874-7de9c8544807: 3479
 *               3eba5d80-4297-11ee-86eb-d7d7d2938882: 3445
 *       400:
 *         description: No viewerIdOrName provided.
 */
router.route("/viewers/:userId/currency")
    .get(viewers.getUserCurrency);

/**
 * @openapi
 * /viewers/{userId}/currency/{currencyId}:
 *   parameters:
 *    - $ref: "#/components/parameters/userIdParam"
 *    - $ref: "#/components/parameters/currencyId"
 *    - $ref: "#/components/parameters/usernameBoolParam"
 *   get:
 *     description: Fetches specific currency details for a viewer.
 *     responses:
 *       200:
 *         description: User currency set successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: 3479
 *       400:
 *         description: No currencyId provided.
 *         content:
 *           application/json:
 *             examples:
 *               NoCurrencyID:
 *                 summary: No currencyId provided.
 *                 value:
 *                   status: error
 *                   message: No currencyId provided.
 *               NoViewer:
 *                 summary: No viewerId provided.
 *                 value:
 *                   status: error
 *                   message: No viewerId provided.
 *   post:
 *     description: Sets the currency for a specific viewer.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               amount:
 *                 description: Value to set/increment.
 *                 type: number
 *               setAmount:
 *                 description: Indicates whether to set or adjust.
 *                 type: string
 *                 enum: [set, adjust]
 *           examples:
 *             set:
 *               value:
 *                 amount: 10
 *                 setAmount: set
 *             adjust:
 *               value:
 *                 amount: 10
 *                 setAmount: adjust
 *     responses:
 *       204:
 *         description: User currency set successfully.
 *       400:
 *         description: No viewerIdOrName provided.
 */
router.route("/viewers/:userId/currency/:currencyId")
    .get(viewers.getUserCurrency)
    .post(viewers.setUserCurrency);

/**
 * @openapi
 * /viewers/{userId}/customRoles:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *   get:
 *     description: Fetches custom roles for a specific viewer.
 *     responses:
 *       200:
 *         description: User custom roles fetched successfully..
 *       400:
 *         description: No viewerIdOrName provided.
 *       404:
 *         description: Specified viewer does not exist.
 */
router.route("/viewers/:userId/customRoles")
    .get(viewers.getUserCustomRoles);

/**
 * @openapi
 * /viewers/{userId}/customRoles/{customRoleId}:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *     - in: path
 *       name: customRoleId
 *       required: true
 *       description: The ID of the custom role.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   post:
 *     description: Adds a specific viewer to a custom role.
 *     responses:
 *       201:
 *         description: Viewer added to custom role successfully.
 *       400:
 *         description: No customRoleId provided.
 *       404:
 *         description: Specified custom role does not exist.
 *   delete:
 *     description: Removes a specific viewer from a custom role.
 *     responses:
 *       204:
 *         description: Viewer added to custom role successfully.
 *       400:
 *         description: No viewerIdOrName provided.
 *       404:
 *         description: Specified viewer does not exist.
 */
router.route("/viewers/:userId/customRoles/:customRoleId")
    .post(viewers.addUserToCustomRole)
    .delete(viewers.removeUserFromCustomRole);

// Custom Roles
import * as customRoles from "./controllers/custom-roles-api-controller";

/**
 * @openapi
 * /customRoles:
 *   get:
 *     description: Fetches all custom roles.
 *     responses:
 *       200:
 *         description: Custom roles fetched successfully.
 */
router.route("/customRoles")
    .get(customRoles.getCustomRoles);

/**
 * @openapi
 * /customRoles/{customRoleId}:
 *   parameters:
 *     - in: path
 *       name: customRoleId
 *       required: true
 *       description: The ID of the custom role.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Fetches a specific custom role by its ID.
 *     responses:
 *       200:
 *         description: Custom role fetched successfully.
 *       400:
 *         description: No customRoleId provided.
 *       404:
 *         description: Custom role customRoleId not found.
 */
router.route("/customRoles/:customRoleId")
    .get(customRoles.getCustomRoleById);

/**
 * @openapi
 * /customRoles/{customRoleId}/clear:
 *   parameters:
 *     - in: path
 *       name: customRoleId
 *       required: true
 *       description: The ID of the custom role.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Clears all viewers from a specific custom role.
 *     responses:
 *       204:
 *         description: All viewers removed from the custom role successfully.
 *       400:
 *         description: No customRoleId provided.
 *       404:
 *         description: Specified custom role does not exist.
 */
router.route("/customRoles/:customRoleId/clear")
    .get(customRoles.removeAllViewersFromRole);

/**
 * @openapi
 * /customRoles/{customRoleId}/viewer/{userId}:
 *   parameters:
 *     - in: path
 *       name: customRoleId
 *       required: true
 *       description: The ID of the custom role.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *     - in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *   post:
 *     description: Adds a specific viewer to a custom role.
 *     responses:
 *       201:
 *         description: Add specific viewer to custom role successfully.
 *       400:
 *         description: No customRoleId provided.
 *         content:
 *           application/json:
 *             examples:
 *               NoRoleID:
 *                 summary: No customRoleId provided.
 *                 value:
 *                   status: error
 *                   message: No customRoleId provided.
 *               NoViewer:
 *                 summary: No viewerId provided.
 *                 value:
 *                   status: error
 *                   message: No viewerId provided.
 *       404:
 *         description: Specified custom role.
 *         content:
 *           application/json:
 *             examples:
 *               NoRole:
 *                 summary: Specified custom role does not exist.
 *                 value:
 *                   status: error
 *                   message: Specified custom role does not exist.
 *               NoViewer:
 *                 summary: Specified viewer does not exist.
 *                 value:
 *                   status: error
 *                   message: Specified viewer does not exist.
 *   delete:
 *     description: Removes a specific viewer from a custom role.
 *     responses:
 *       204:
 *         description: Add specific viewer to custom role successfully.
 *       400:
 *         description: No customRoleId provided.
 *         content:
 *           application/json:
 *             examples:
 *               NoRoleID:
 *                 summary: No customRoleId provided.
 *                 value:
 *                   message: No customRoleId provided.
 *               NoViewer:
 *                 summary: No viewerId provided.
 *                 value:
 *                   message: No viewerId provided.
 *       404:
 *         description: Specified custom role does not exist.
 *         content:
 *           application/json:
 *             examples:
 *               RoleNotExist:
 *                 summary: Specified custom role does not exist.
 *                 value:
 *                   status: error
 *                   message: Specified custom role does not exist.
 *               ViewerNotExist:
 *                 summary: Specified viewer does not exist.
 *                 value:
 *                   status: error
 *                   message: specified viewer does not exist.
 */
router.route("/customRoles/:customRoleId/viewer/:userId")
    .post(customRoles.addUserToCustomRole)
    .delete(customRoles.removeUserFromCustomRole);

// Currencies
import * as currency from "./controllers/currency-api-controller";

/**
 * @openapi
 * /currency:
 *   get:
 *     description: Fetches all currencies.
 *     responses:
 *       200:
 *         description: Currencies fetched successfully.
 */
router.route("/currency")
    .get(currency.getCurrencies);

/**
 * @openapi
 * /currency/{currencyName}:
 *   parameters:
 *     - in: path
 *       name: currencyName
 *       required: true
 *       description: The name of the currency.
 *       schema:
 *         type: string
 *   get:
 *     description: Fetches specific currency details by name.
 *     responses:
 *       200:
 *         description: Currency details fetched successfully.
 */
router.route("/currency/:currencyName")
    .get(currency.getCurrencies);

/**
 * @openapi
 * /currency/{currencyName}/top:
 *   parameters:
 *     - in: path
 *       name: currencyName
 *       required: true
 *       description: The name of the currency.
 *       schema:
 *         type: string
 *     - in: query
 *       name: count
 *       schema:
 *         type: integer
 *       description: top count to return.
 *   get:
 *     description: Fetches top currency holders for a specific currency.
 *     responses:
 *       200:
 *         description: Top currency holders fetched successfully.
 */
router.route("/currency/:currencyName/top")
    .get(currency.getTopCurrencyHolders);

// Quotes
import * as quotes from "./controllers/quotes-api-controller";

/**
 * @openapi
 * /quotes:
 *   get:
 *     description: Fetches all quotes.
 *     responses:
 *       200:
 *         description: Quote updated successfully.
 *   post:
 *     description: Posts a new quote.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               text:
 *                 description: The text of the quote.
 *                 type: string
 *                 example: you can't shoot me, if you don't have any arms
 *               game:
 *                 description: The game that is being played.
 *                 type: string
 *                 example: Fallout 76
 *               originator:
 *                 description: Who said the quote.
 *                 type: string
 *                 example: arblane
 *               creator:
 *                 description: Who quoted it.
 *                 type: string
 *                 example: Ripdan
 *     responses:
 *       201:
 *         description: Quote updated successfully.
 *         content:
 *           application/json:
 *             examples:
 *               QuoteUpdated:
 *                 summary: Quote updated successfully.
 *                 value:
 *       400:
 *         description: Missing quote text
 *         content:
 *           application/json:
 *             examples:
 *               MissingText:
 *                 summary: Missing quote text.
 *                 value:
 *                   status: error
 *                   message: Missing quote text.
 *               NoCreator:
 *                 summary: Missing quote creator.
 *                 value:
 *                   status: error
 *                   message: Missing quote creator.
 *       500:
 *         description: Error creating quote 'reason'.
 */
router.route("/quotes")
    .get(quotes.getQuotes)
    .post(quotes.postQuote);

/**
 * @openapi
 * /quotes/{quoteId}:
 *   parameters:
 *     - in: path
 *       name: quoteId
 *       required: true
 *       description: The ID of the quote.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Fetches a specific quote by its ID.
 *     responses:
 *       200:
 *         description: Quote fetched successfully.
 *       404:
 *         description: Quote quoteId not found.
 *   put:
 *     description: Updates a specific quote by its ID.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               text:
 *                 description: The text of the quote.
 *                 type: string
 *                 example: I have derpkitty.
 *               game:
 *                 description: The game that is being played.
 *                 type: string
 *                 example: Minecraft
 *               originator:
 *                 description: Who said the quote.
 *                 type: string
 *                 example: Katwyld
 *               creator:
 *                 description: Who quoted it.
 *                 type: string
 *                 example: lowercqse
 *     responses:
 *       201:
 *         description: Quote updated successfully.
 *       400:
 *         description: Missing quote text
 *         content:
 *           application/json:
 *             examples:
 *               MissingText:
 *                 summary: Missing quote text.
 *                 value:
 *                   status: error
 *                   message: Missing quote text.
 *               NoCreator:
 *                 summary: Missing quote creator.
 *                 value:
 *                   status: error
 *                   message: Missing quote creator.
 *       500:
 *         description: Error creating quote 'reason'.
 *   patch:
 *     description: Partially updates a specific quote by its ID.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               text:
 *                 description: The text of the quote.
 *                 type: string
 *                 example: I have derpkitty.
 *               game:
 *                 description: The game that is being played.
 *                 type: string
 *                 example: Minecraft
 *               originator:
 *                 description: Who said the quote.
 *                 type: string
 *                 example: Katwyld
 *               creator:
 *                 description: Who quoted it.
 *                 type: string
 *                 example: DrRedPanda
 *               createdAt:
 *                 description: When the quote happend.
 *                 type: string
 *                 example: 01/05/2022
 *     responses:
 *       201:
 *         description: Quote updated successfully.
 *       404:
 *         description: Quote quoteId not found.
 *       500:
 *         description: Error creating quote 'reason'.
 *   delete:
 *     description: Deletes a specific quote by its ID.
 *     responses:
 *       204:
 *         description: Quote deleted successfully.
 *       404:
 *         description: Quote quoteId not found.
 */
router.route("/quotes/:quoteId")
    .get(quotes.getQuote)
    .put(quotes.putQuote)
    .patch(quotes.patchQuote)
    .delete(quotes.deleteQuote);

// Counters
import * as counters from "./controllers/counters-api-controller";

/**
 * @openapi
 * /counters:
 *   get:
 *     description: Fetches all counters.
 *     responses:
 *       200:
 *         description: Counters fetched successfully.
 */
router.route("/counters")
    .get(counters.getCounters);

/**
 * @openapi
 * /counters/{counterId}:
 *   parameters:
 *     - in: path
 *       name: counterId
 *       required: true
 *       description: The ID of the counter.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Fetches a specific counter by its ID.
 *     responses:
 *       200:
 *         description: Counter fetched successfully.
 *       400:
 *         description: No counterId provided.
 *       404:
 *         description: Counter counterId not found.
 *   post:
 *     description: Updates a specific counter by its ID.
 *     requestBody:
 *       content:
 *         "application/x-www-form-urlencoded":
 *           schema:
 *             properties:
 *               value:
 *                 description: The value to increment set/increment the counter.
 *                 type: number
 *                 example: 20
 *               override:
 *                 description: Overwrite the current value.
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Counter updated successfully.
 *       400:
 *         description: No counterId provided.
 *         content:
 *           application/json:
 *             examples:
 *               CounterIdProvided:
 *                 summary: No counterId provided.
 *                 value:
 *                   status: error
 *                   message: No counterId provided.
 *               ValueNotPresent:
 *                 summary: Value not present.
 *                 value:
 *                   status: error
 *                   message: Value not present.
 *               ValueNAN:
 *                 summary: Value must be a number.
 *                 value:
 *                   status: error
 *                   message: Value must be a number.
 *               OverrideBool:
 *                 summary: Override must be a boolean.
 *                 value:
 *                   status: error
 *                   message: Override must be a boolean.
 *       404:
 *         description: Counter counterId not found.
 */
router.route("/counters/:counterId")
    .get(counters.getCounterById)
    .post(counters.updateCounter);

// Timers
import * as timers from "./controllers/timers-api-controller";

/**
 * @openapi
 * /timers:
 *   get:
 *     description: Fetches all timers.
 *     responses:
 *       200:
 *         description: Timers fetched successfully.
 */
router.route("/timers")
    .get(timers.getTimers);

/**
 * @openapi
 * /timers/{timerId}:
 *   parameters:
 *     - in: path
 *       name: timerId
 *       required: true
 *       description: The ID of the timer.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Fetches a specific timer by its ID.
 *     responses:
 *       200:
 *         description: Timer fetched successfully.
 *       400:
 *         description: No timerId provided.
 *       404:
 *         description: Timer timerId not found.
 */
router.route("/timers/:timerId")
    .get(timers.getTimerById);

/**
 * @openapi
 * /timers/{timerId}/{action}:
 *   parameters:
 *     - in: path
 *       name: timerId
 *       required: true
 *       description: The ID of the timer.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *     - in: path
 *       name: action
 *       required: true
 *       description: The action to be preformed. can be "toggle", "enable", "disable" or "clear".
 *       schema:
 *         type: string
 *         enum: [toggle, enable, disable, clear]
 *   get:
 *     description: Updates a specific timer by its ID.
 *     responses:
 *       200:
 *         description: Timer updated successfully.
 *       400:
 *         description: invalid action provided.
 *         content:
 *           application/json:
 *             examples:
 *               InvalidAction:
 *                 summary: Invalid action provided.
 *                 value:
 *                   status: error
 *                   message: Invalid action provided.
 *               TimerIdProvided:
 *                 summary: No timerId provided.
 *                 value:
 *                   status: error
 *                   message: No timerId provided.
 *       404:
 *         description: Timer timerId not found.
 */
router.route("/timers/:timerId/:action")
    .get(timers.updateTimerById);

//queues
import * as queues from "./controllers/effect-queues-api-controller";

/**
 * @openapi
 * /queues:
 *   get:
 *     description: Fetches all queues.
 *     responses:
 *       200:
 *         description: Queue updated successfully.
 */
router.route("/queues")
    .get(queues.getQueues);

/**
 * @openapi
 * /queues/{queueId}:
 *   parameters:
 *     - in: path
 *       name: queueId
 *       required: true
 *       description: The ID of the queue.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Fetches a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue fetched successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 */
router.route("/queues/:queueId")
    .get(queues.getQueueById);

/**
 * @openapi
 * /queues/{queueId}/pause:
 *   parameters:
 *     - in: path
 *       name: queueId
 *       required: true
 *       description: The ID of the queue.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Pauses a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue paused successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 *   post:
 *     description: Pauses a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue paused successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 */
router.route("/queues/:queueId/pause")
    .get(queues.pauseQueue)
    .post(queues.pauseQueue);

/**
 * @openapi
 * /queues/{queueId}/resume:
 *   parameters:
 *     - in: path
 *       name: queueId
 *       required: true
 *       description: The ID of the queue.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Resumes a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue resumed successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 *   post:
 *     description: Resumes a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue resumed successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 */
router.route("/queues/:queueId/resume")
    .get(queues.resumeQueue)
    .post(queues.resumeQueue);

/**
 * @openapi
 * /queues/{queueId}/toggle:
 *   parameters:
 *     - in: path
 *       name: queueId
 *       required: true
 *       description: The ID of the queue.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Toggles a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue toggled successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 *   post:
 *     description: Toggles a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue toggled successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 */
router.route("/queues/:queueId/toggle")
    .get(queues.toggleQueue)
    .post(queues.toggleQueue);

/**
 * @openapi
 * /queues/{queueId}/clear:
 *   parameters:
 *     - in: path
 *       name: queueId
 *       required: true
 *       description: The ID of the queue.
 *       schema:
 *         $ref: '#/components/schemas/UUIDString'
 *   get:
 *     description: Clears a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue cleared successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 *   post:
 *     description: Clears a specific queue by its ID.
 *     responses:
 *       200:
 *         description: Queue cleared successfully.
 *       400:
 *         description: No queueId provided.
 *       404:
 *         description: Queue queueId not found.
 */
router.route("/queues/:queueId/clear")
    .get(queues.clearQueue)
    .post(queues.clearQueue);

module.exports = router;
/**
 * @openapi
 * components:
 *   schemas:
 *     UUIDString: # Can be referenced via '#/components/schemas/UUIDString'
 *       type: string
 *       format: uuid
 *   parameters:
 *     userIdParam: # Can be referenced via '#/components/parameters/userParam'
 *       in: path
 *       name: userId
 *       required: true
 *       description: An ID that uniquely identifies the user.
 *       schema:
 *         type: string
 *     metadataKeyParam:
 *       in: path
 *       name: metadataKey
 *       required: true
 *       description: The key of the metadata to be modified or deleted.
 *       schema:
 *         type: string
 *     usernameBoolParam:
 *       in: query
 *       name: username
 *       description: use username or userId true/false (default false).
 *       schema:
 *         type: string
 *     currencyId: # Can be referenced via '#/components/parameters/currencyId'
 *       in: path
 *       name: currencyId
 *       required: true
 *       description: The ID of the currency.
 *       schema:
 *         $ref: "#/components/schemas/UUIDString"
 * tags:
 *   - name: auth
 *     description: auth endpoints
 *   - name: status
 *     description: get the connection status
 *   - name: effects
 *     description: find out all about effects
 */