"use strict";

(function() {
    angular.module("firebotApp")
        .component("addOrEditDynamicModal", {
            template: `
                <div class="modal-header">
                    <button type="button" class="close" ng-click="$ctrl.dismiss()"><span>&times;</span></button>
                    <h4 class="modal-title">{{$ctrl.isNew ? 'Add' : 'Edit'}} {{$ctrl.title}}</h4>
                </div>
                <div class="modal-body">
<!--
                    <form name="giftReceiver">

                        <div class="form-group" ng-class="{'has-error': $ctrl.formFieldHasError('gifteeUsername')}">
                            <label for="gifteeUsername" class="control-label">Giftee Username</label>
                            <input
                                type="text"
                                id="gifteeUsername"
                                name="gifteeUsername"
                                class="form-control input-md"
                                placeholder="Enter giftee username"
                                ng-model="$ctrl.giftReceiver.gifteeUsername"
                                ui-validate="'$value != null && $value.length > 0'"
                                required
                                menu-position="under"
                            />
                        </div>

                        <div class="form-group" ng-class="{'has-error': $ctrl.formFieldHasError('giftSubMonths')}">
                            <label for="giftSubMonths" class="control-label">Gift Sub Months</label>
                            <input
                                type="number"
                                id="giftSubMonths"
                                name="giftSubMonths"
                                class="form-control input-md"
                                placeholder="Enter months"
                                ng-model="$ctrl.giftReceiver.giftSubMonths"
                                ui-validate="'$value != null && $value > 0'"
                                required
                                menu-position="under"
                                style="width: 50%;"
                            />
                        </div>

                    </form>
-->
                    <div>
                        <!--<div ng-hide="$ctrl.options.useModal" ng-repeat="values in $ctrl.model track by $index" class="list-item selectable" style="border: 2px solid #4c4f4f;"> -->
                            <div ng-hide="$ctrl.options.useModal" ng-repeat="values in $ctrl.model track by $index" class="list-item selectable" style="border: 2px solid #4c4f4f;"> <!-- non-modal -->
                            <div style="flex-direction: column; width: 100%">
                                <div
                                    class="mr-2"
                                    ng-repeat="data in $ctrl.metadata[$index]"
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
                            <span class="ml-2 clickable" style="color: #fb7373;" ng-click="$ctrl.removeAtIndex($index);$event.stopPropagation();" aria-label="Remove {{$ctrl.options.title}}">
                                <i class="fad fa-trash-alt" aria-hidden="true"></i>
                            </span>
                        </div>
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
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" ng-click="$ctrl.dismiss()">Cancel</button>
                    <button type="button" class="btn btn-primary" ng-click="$ctrl.save()">Save</button>
                </div>
            `,
            bindings: {
                resolve: "<",
                close: "&",
                dismiss: "&",
                metadata: "<"
            },
            controller: function($scope) {
                const $ctrl = this;

                $ctrl.isNew = true;
                $ctrl.model = [];
                $ctrl.elements = {};

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

                    const value = {};
                    $ctrl.model.push(value);

                    if (
                        $ctrl.metadata == null ||
                        $ctrl.metadata.value == null ||
                        !Array.isArray($ctrl.metadata.value) ||
                        $ctrl.metadata.value.length === 0
                    ) {
                        console.log("danger! $ctrl.metadata is wrong");
                    }

                    const mmd = $ctrl.metadata.value[0];

                    if (mmd == null || typeof mmd !== "object") {
                        console.log("danger! mmd is wrong");
                    }

                    $ctrl.metadata.push(Object.entries(mmd).map(([key, data]) => {
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
