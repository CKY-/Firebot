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
                    <form name="elements">
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

                $ctrl.elements = {};

                $ctrl.model = [];

                $ctrl.metadata = [];

                $ctrl.manuelMetadata = {};

                const getTitle = (title) => {
                    const titleArray = title.split(/(?=[A-Z])/);

                    const capitalized = titleArray.map(word => word.charAt(0).toUpperCase() + word.slice(1, word.length));
                    return capitalized.join(" ");
                };

                $ctrl.formFieldHasError = (fieldName) => {
                    return ($scope.elements.$submitted || $scope.elements[fieldName].$touched)
                        && $scope.elements[fieldName].$invalid;
                };

                $ctrl.$onInit = () => {
                    if ($ctrl.resolve.elements != null) {
                        $ctrl.elements = JSON.parse(angular.toJson($ctrl.resolve.elements));
                        $ctrl.isNew = false;
                    }

                    if ($ctrl.resolve.manualMetadata != null) {
                        $ctrl.manualMetadata = JSON.parse(angular.toJson($ctrl.resolve.manualMetadata));
                    }
                    $ctrl.addNewElement();
                };

                $ctrl.updateField = (value, fieldName, ref) => {
                    ref[fieldName] = value;
                };

                $ctrl.addNewElement = () => {
                    const value = {};
                    $ctrl.model.push(value);

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
                };

                $ctrl.showAddOrEditElementModal = (element) => {
                    utilityService.showModal({
                        component: "addOrEditDynamicModal",
                        size: "md",
                        resolveObj: {
                            manualMetadata: () => $ctrl.manualMetadata,
                            element: () => element
                        },
                        closeCallback: (element) => {
                            //validate data?
                            //$ctrl.model = $ctrl.model.filter(gr => gr.gifteeUsername !== element.gifteeUsername);
                            $ctrl.model.push(element);
                        }
                    });
                    console.log($ctrl.model);
                };

                $ctrl.removeAtIndex = (index) => {
                    $ctrl.model.splice(index, 1);
                    $ctrl.metadata.splice();
                };

                $ctrl.save = () => {
                    $scope.elements.$setSubmitted();
                    if ($scope.elements.$invalid) {
                        return;
                    }

                    $ctrl.close({
                        $value: $ctrl.elements
                    });
                };
            }
        });
}());
