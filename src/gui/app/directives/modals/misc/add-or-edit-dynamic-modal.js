"use strict";

(function() {
    angular.module("firebotApp")
        .component("addOrEditDynamicModal", {
            template: `
                <div class="modal-header">
                    <button type="button" class="close" ng-click="$ctrl.dismiss()"><span>&times;</span></button>
                    <h4 class="modal-title">{{$ctrl.isNew ? 'Add' : 'Edit'}} {{$ctrl.options.title}}</h4>
                </div>
                <div class="modal-body">
                    <form name="metadata">
                        <div style="flex-direction: column; width: 100%">
                            <div
                                    class="mr-2"
                                    ng-repeat="data in $ctrl.metadata[0]"
                                    style="width: 100%; margin-bottom: unset;"
                                    aria-label="{{data.title}}"
                                >
                                    <command-option
                                        name="data.title"
                                        style="width: 100%;"
                                        metadata="data"
                                        on-update="$ctrl.updateField(value, key, values)"
                                    ></command-option>
                                </div>
                            </div>
                        </div>
                    <form>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" ng-click="$ctrl.dismiss()">Cancel</button>
                    <button type="button" class="btn btn-primary" ng-click="$ctrl.save()">Save</button>
                </div>
            `,
            bindings: {
                resolve: "<",
                close: "&",
                dismiss: "&"
            },
            controller: function($scope, utilityService) {
                const $ctrl = this;

                $ctrl.isNew = true;

                $ctrl.options = {};

                $ctrl.element = {};

                $ctrl.metadata = [];

                $ctrl.manuelMetadata = {};

                const getTitle = (title) => {
                    const titleArray = title.split(/(?=[A-Z])/);

                    const capitalized = titleArray.map(word => word.charAt(0).toUpperCase() + word.slice(1, word.length));
                    return capitalized.join(" ");
                };

                $ctrl.formFieldHasError = (fieldName) => {
                    return ($scope.manualMetadata.$submitted || $scope.manualMetadata[fieldName].$touched)
                        && $scope.manualMetadata[fieldName].$invalid;
                };

                $ctrl.$onInit = () => {
                    if ($ctrl.resolve.element != null) {
                        $ctrl.element = JSON.parse(angular.toJson($ctrl.resolve.element));
                        $ctrl.isNew = false;
                    }

                    if ($ctrl.resolve.index != null) {
                        $ctrl.index = JSON.parse(angular.toJson($ctrl.resolve.index));
                    }

                    if ($ctrl.resolve.manualMetadata != null) {
                        $ctrl.manualMetadata = JSON.parse(angular.toJson($ctrl.resolve.manualMetadata));
                    }
                    $ctrl.addNewElement();
                };

                $ctrl.updateField = (value, fieldName, ref) => {
                    if ((value !== undefined && ref !== undefined)) { //|| Object.entries
                        ref[fieldName] = value;
                    }
                };

                $ctrl.addNewElement = () => {
                    const value = {};
                    //$ctrl.metadata.push(value);

                    if (
                        $ctrl.manualMetadata == null ||
                        $ctrl.manualMetadata.value == null ||
                        !Array.isArray($ctrl.manualMetadata.value) ||
                        $ctrl.manualMetadata.value.length === 0
                    ) {
                        console.log("danger! $ctrl.manualMetadata is wrong");
                    }

                    const mmd = $ctrl.manualMetadata.value[0];

                    if (mmd == null || typeof mmd !== "object") {
                        console.log("danger! mmd is wrong");
                    }
                    if ($ctrl.element && Object.keys($ctrl.element).length) {
                        $ctrl.metadata = structuredClone($ctrl.element);
                    } else {
                        $ctrl.metadata.push(Object.entries(mmd).map(([key, data]) => {
                            $ctrl.options = data.options;
                            if (data == null || typeof data !== "object") {
                                return {
                                    key,
                                    title: getTitle(key),
                                    type: data == null ? "string" : typeof data,
                                    value: value[key]
                                };
                            }
                            return {
                                key,
                                title: getTitle(key),
                                type: data.type,
                                value: value[key],
                                options: data.options,
                                metadata: data
                            };
                        }));
                    }
                };

                $ctrl.showAddOrEditElementModal = (element, index) => {
                    utilityService.showModal({
                        component: "addOrEditDynamicModal",
                        size: "md",
                        resolveObj: {
                            index: () => index,
                            manualMetadata: () => $ctrl.manualMetadata,
                            element: () => element
                        },
                        closeCallback: (element) => {
                            $ctrl.metadata[element.index] = element.element;
                        }
                    });
                    console.log("metadata");
                    console.log($ctrl.metadata);
                };

                $ctrl.removeAtIndex = (index) => {
                    $ctrl.metadata.splice(index, 1);
                };

                $ctrl.save = () => {
                    $scope.metadata.$setSubmitted();
                    if ($scope.metadata.$invalid) {
                        return;
                    }

                    $ctrl.close({
                        $value: {
                            element: $ctrl.metadata,
                            index: $ctrl.index ?? 0
                        }
                    });
                };
            }
        });
}());
