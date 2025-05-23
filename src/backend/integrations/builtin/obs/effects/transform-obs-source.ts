import { EffectType } from "../../../../../types/effects";
import { OBSSceneItem, OBSSourceTransformKeys, transformSceneItem } from "../obs-remote";

export const TransformSourceEffectType: EffectType<{
    sceneName?: string;
    sceneItem?: OBSSceneItem;
    duration: string | number;
    easeIn: boolean;
    easeOut: boolean;
    isTransformingPosition: boolean;
    isTransformingScale: boolean;
    isTransformingRotation: boolean;
    alignment: number;
    startTransform: Record<string, string>;
    endTransform: Record<string, string>;
}> = {
    definition: {
        id: "firebot:obs-transform-source",
        name: "Transform OBS Source",
        description: "Transforms the position, scale, or rotation of an OBS source either instantly or animated over time",
        icon: "fad fa-arrows",
        categories: ["common"]
    },
    optionsTemplate: `
        <eos-container ng-if="isUsingInvalidItemId" pad-top="true">
            <div class="alert alert-danger">
                <p style="margin: 0">
                    <b>Error:</b> Due to a previous bug with duplicating Preset Effect Lists, you will need to set the Scene Item again, this shouldn't be necessary again in the future.
                </p>
            </div>
        </eos-container>
        <eos-container header="OBS Scene" pad-top="true">
            <div>
                <button class="btn btn-link" ng-click="getScenes()">Refresh Scene Data</button>
            </div>
            <ui-select ng-if="scenes != null" ng-model="effect.sceneName" on-select="selectScene($select.selected.name)">
                <ui-select-match placeholder="Select a Scene...">{{$select.selected.name}}</ui-select-match>
                <ui-select-choices repeat="scene.name as scene in scenes | filter: {name: $select.search}">
                    <div ng-bind-html="scene.name | highlight: $select.search"></div>
                </ui-select-choices>
                <ui-select-no-choice>
                    <b>No Scenes found.</b>
                </ui-select-no-choice>
            </ui-select>
        </eos-container>
        <eos-container ng-if="sceneItems != null && effect.sceneName != null" header="OBS Source" pad-top="true">
            <div>
                <button class="btn btn-link" ng-click="getSources(effect.sceneName)">Refresh Source Data</button>
            </div>
            <ui-select ng-if="sceneItems != null" ng-model="effect.sceneItem.name" on-select="selectSceneItem($select.selected)">
                <ui-select-match placeholder="Select a Source...">{{$select.selected.name}}</ui-select-match>
                <ui-select-choices repeat="sceneItem.name as sceneItem in sceneItems | filter: {name: $select.search}">
                    <div ng-bind-html="sceneItem.name | highlight: $select.search"></div>
                </ui-select-choices>
                <ui-select-no-choice>
                    <b>No transformable sources found.</b>
                </ui-select-no-choice>
            </ui-select>
            <div ng-if="sceneItems == null" class="muted">
                No transformable sources found. {{ isObsConfigured ? "Is OBS running?" : "Have you configured the OBS integration?" }}
            </div>
        </eos-container>
        <div ng-if="effect.sceneItem != null">
            <eos-container header="Duration" pad-top="true">
                <firebot-input
                    input-type="number"
                    input-title="Duration"
                    placeholder-text="seconds"
                    model="effect.duration"
                    style="margin-bottom: 20px;" />
                <div style="display: flex; gap: 20px;">
                    <firebot-checkbox 
                        label="Ease-In" 
                        tooltip="Smooth the start of the animation" 
                        model="effect.easeIn"
                        style="flex-basis: 50%" />
                    <firebot-checkbox 
                        label="Ease-Out" 
                        tooltip="Smooth the end of the animation" 
                        model="effect.easeOut"
                        style="flex-basis: 50%" />
                </div>
            </eos-container>
            <eos-container header="Positional Alignment" pad-top="true">
                <dropdown-select
                    options="alignmentOptions"
                    selected="effect.alignment"
                    placeholder="Unchanged" />
            </eos-container>
            <eos-container header="Transform" pad-top="true">
                <firebot-checkbox 
                    label="Position" 
                    tooltip="Transform the position of the OBS source" 
                    model="effect.isTransformingPosition" />
                <div ng-if="effect.isTransformingPosition" style="margin-top: 10px">
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <firebot-input
                            input-title="Start X"
                            placeholder-text="Current X"
                            model="effect.startTransform.positionX"
                            style="flex-basis: 50%" />
                        <firebot-input
                            input-title="Start Y"
                            placeholder-text="Current Y"
                            model="effect.startTransform.positionY"
                            style="flex-basis: 50%" />
                    </div>
                    <div style="display: flex; gap: 20px; margin-bottom: 20px">
                        <firebot-input
                            input-title="End X"
                            placeholder-text="Position in pixels"
                            model="effect.endTransform.positionX"
                            style="flex-basis: 50%" />
                        <firebot-input
                            input-title="End Y"
                            placeholder-text="Position in pixels"
                            model="effect.endTransform.positionY"
                            style="flex-basis: 50%" />
                    </div>
                </div>
                <firebot-checkbox 
                    label="Scale" 
                    tooltip="Transform the scale of the OBS source" 
                    model="effect.isTransformingScale" />
                <div ng-if="effect.isTransformingScale" style="margin-bottom: 20px">
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <firebot-input
                            input-title="Start X Scale"
                            placeholder-text="Current X Scale"
                            model="effect.startTransform.scaleX"
                            style="flex-basis: 50%" />
                        <firebot-input
                            input-title="Start Y Scale"
                            placeholder-text="Current Y Scale"
                            model="effect.startTransform.scaleY"
                            style="flex-basis: 50%" />
                    </div>
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <firebot-input
                            input-title="End X Scale"
                            placeholder-text="eg. 0.5 = 50% scale"
                            model="effect.endTransform.scaleX"
                            style="flex-basis: 50%" />
                        <firebot-input
                            input-title="End Y Scale"
                            placeholder-text="eg. 0.5 = 50% scale"
                            model="effect.endTransform.scaleY"
                            style="flex-basis: 50%" />
                    </div>
                </div>
                <firebot-checkbox 
                    label="Rotation" 
                    tooltip="Transform the rotation of the OBS source" 
                    model="effect.isTransformingRotation" />
                <div ng-if="effect.isTransformingRotation" style="margin-bottom: 20px">
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <firebot-input
                            input-title="Start Rotation"
                            placeholder-text="Current Rotation"
                            model="effect.startTransform.rotation"
                            style="flex-basis: 50%" />
                        <firebot-input
                            input-title="End Rotation"
                            placeholder-text="rotation in degrees"
                            model="effect.endTransform.rotation"
                            style="flex-basis: 50%" />
                    </div>
                </div>
            </eos-container>
        </div>
    `,
    optionsController: ($scope: any, backendCommunicator: any) => {
        $scope.isObsConfigured = false;
        $scope.isUsingInvalidItemId = false;

        $scope.scenes = [];
        $scope.sceneItems = [];
        $scope.alignmentOptions = Object.freeze({
            [5]: "Top Left",
            [4]: "Top",
            [6]: "Top Right",
            [1]: "Center Left",
            [0]: "Center",
            [2]: "Center Right",
            [8]: "Bottom",
            [9]: "Bottom Left",
            [10]: "Bottom Right"
        });

        // If legacy property sceneItem.id exists, we need to fix it
        if (!!$scope.effect.sceneItem?.id) {
            if (typeof ($scope.effect.sceneItem.id) !== "number") {
                $scope.isUsingInvalidItemId = true;
                delete $scope.effect.sceneItem;
            } else {
                $scope.effect.sceneItem.itemId = $scope.effect.sceneItem.id;
                delete $scope.effect.sceneItem.id;
            }
        }

        $scope.selectScene = (sceneName: string) => {
            $scope.effect.sceneItem = undefined;
            $scope.getSources(sceneName);
        };

        $scope.selectSceneItem = (sceneItem: OBSSceneItem) => {
            $scope.effect.sceneItem = sceneItem;
            $scope.isUsingInvalidItemId = false;
        };

        $scope.getScenes = () => {
            $scope.isObsConfigured = backendCommunicator.fireEventSync("obs-is-configured");

            backendCommunicator.fireEventAsync("obs-get-scene-list").then(
                (scenes: string[] | undefined) => {
                    $scope.scenes = scenes?.map(scene => ({ name: scene, custom: false })) ?? [];
                    $scope.scenes.push($scope.customScene);

                    if ($scope.effect.sceneName != null) {
                        $scope.getSources($scope.effect.sceneName);
                    }
                }
            );
        };
        $scope.getScenes();

        $scope.getSources = (sceneName: string) => {
            $scope.isObsConfigured = backendCommunicator.fireEventSync("obs-is-configured");

            backendCommunicator.fireEventAsync("obs-get-transformable-scene-items", [sceneName]).then(
                (sceneItems: OBSSceneItem[]) => {
                    $scope.sceneItems = sceneItems ?? [];
                }
            );
        };
    },
    optionsValidator: (effect) => {
        if (effect.sceneName == null) {
            return ["Please select a scene."];
        }
        if (effect.sceneItem == null) {
            return ["Please select a source."];
        }
        if (effect.duration == null || effect.duration === "") {
            return ["Please enter a duration."];
        }
        return [];
    },
    getDefaultLabel: (effect) => {
        return effect.sceneItem ? `${effect.sceneName} - ${effect.sceneItem?.name}` : "";
    },
    onTriggerEvent: async ({ effect }) => {
        if (isNaN(Number(effect.duration))) {
            effect.duration = 0;
        }
        const alignment = effect.alignment ? Number(effect.alignment) : undefined;
        const parsedStart: Record<string, number> = {};
        const parsedEnd: Record<string, number> = {};
        const transformKeys: Array<OBSSourceTransformKeys> = [];
        if (effect.isTransformingPosition) {
            transformKeys.push("positionX", "positionY");
        }
        if (effect.isTransformingScale) {
            transformKeys.push("scaleX", "scaleY");
        }
        if (effect.isTransformingRotation) {
            transformKeys.push("rotation");
        }

        transformKeys.forEach((key) => {
            if (effect.startTransform?.hasOwnProperty(key) && effect.startTransform[key].length) {
                const value = Number(effect.startTransform[key]);
                if (!isNaN(value)) {
                    parsedStart[key] = value;
                }
            }
            if (effect.endTransform?.hasOwnProperty(key) && effect.endTransform[key].length) {
                const value = Number(effect.endTransform[key]);
                if (!isNaN(value)) {
                    parsedEnd[key] = value;
                }
            }
        });

        await transformSceneItem(
            effect.sceneItem.groupName ?? effect.sceneName,
            effect.sceneItem.id ?? effect.sceneItem.itemId,
            Number(effect.duration) * 1000,
            parsedStart,
            parsedEnd,
            effect.easeIn,
            effect.easeOut,
            alignment
        );

        return true;
    }
};
