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
            <!--          <div ng-repeat="values in $ctrl.model track by $index" class="list-item selectable" style="border: 2px solid #4c4f4f;">
        -->           <div style="flex-direction: column; width: 100%">
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
<!--                        <span ng-show="$ctrl.model.length > 1" class="ml-2 clickable" style="color: #fb7373;" ng-click="$ctrl.removeAtIndex($index);$event.stopPropagation();" aria-label="Remove {{$ctrl.options.title}}">
                            <i class="fad fa-trash-alt" aria-hidden="true"></i>
                        </span>
                    </div>
                    <p class="muted" ng-show="$ctrl.model.length < 1">No {{$ctrl.options.title}} added.</p>
                    <div class="mx-0 mt-2.5 mb-4">
                        <button ng-show="$ctrl.options.useModal" class="filter-bar" ng-click="$ctrl.showAddOrEditElementModal()" uib-tooltip="Add {{$ctrl.options.title}}" tooltip-append-to-body="true" aria-label="Add {{$ctrl.options.title}}">
                            <i class="far fa-plus"></i>
                        </button>
                        <button ng-hide="$ctrl.options.useModal" class="filter-bar" ng-click="$ctrl.addNewElement()" uib-tooltip="Add {{$ctrl.options.title}}" tooltip-append-to-body="true" aria-label="Add {{$ctrl.options.title}}">
                            <i class="far fa-plus"></i>
                        </button>

                    </div>
-->                </div>
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
