"use strict";

(function() {
    angular
        .module('firebotApp')
        .component("simulateList", {
            bindings: {
                model: "=",
                manualMetadata: "=",
                options: "=",
                onUpdate: '&'
            },
            template: `
                <div>
                    <div ng-show="$ctrl.options.useModal" ng-repeat="values in $ctrl.model track by $index" class="list-item selectable" ng-click="$ctrl.showAddOrEditElementModal(values, $index)"> <!-- modal-based -->
                          <!-- (key, title, value, type) -->
                        <div ng-repeat="obj in values">
                                <div ng-repeat="childobj in obj" uib-tooltip="Click to edit" class="ml-8" style="font-weight: 400;width: 100%;" aria-label="{{childobj.title + ' (Click to edit)'}}">
                                    <div ng-if="childobj.type !== 'simulate-list'">
                                        <b>{{childobj.title}}:</b> {{childobj.value}}
                                    </div> 
                                </div>
                        </div>
                        <span class="clickable" style="color: #fb7373;" ng-click="$ctrl.removeAtIndex($index);$event.stopPropagation();" aria-label="Remove $ctrl.options.title">
                            <i class="fad fa-trash-alt" aria-hidden="true"></i>
                        </span>
                    </div>

                        <div ng-hide="$ctrl.options.useModal" ng-repeat="values in $ctrl.model track by $index" class="list-item selectable" style="border: 2px solid #4c4f4f;"> <!-- non-modal -->
                            <div style="flex-direction: column; width: 100%">
                                <div
                                    class="mr-2.5"
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
                            <span class="ml-mt-2.5 clickable" style="color: #fb7373;" ng-click="$ctrl.removeAtIndex($index);$event.stopPropagation();" aria-label="Remove {{$ctrl.options.title}}">
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
                </div>
            `,
            controller: function(utilityService) {
                const $ctrl = this;
                $ctrl.metadata = [];

                const getTitle = (title) => {
                    const titleArray = title.split(/(?=[A-Z])/);

                    const capitalized = titleArray.map(word => word.charAt(0).toUpperCase() + word.slice(1, word.length));
                    return capitalized.join(" ");
                };

                $ctrl.isAnon = (isAnon) => {
                    console.log(isAnon);
                };

                $ctrl.updateField = (value, fieldName, ref) => {
                    ref[fieldName] = value;
                };

                $ctrl.$onInit = () => {
                    if ($ctrl.model == null) {
                        $ctrl.model = [];
                    } else {
                        $ctrl.metadata = structuredClone($ctrl.model);
                    }
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
                    // if ($ctrl.model && Object.keys($ctrl.model).length) {
                    //     $ctrl.metadata = structuredClone($ctrl.model);
                    //     return;
                    // }
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

                $ctrl.showAddOrEditElementModal = (element, index) => {
                    utilityService.showModal({
                        component: "addOrEditDynamicModal",
                        size: "md",
                        resolveObj: {
                            index: () => index ?? $ctrl.model.length,
                            manualMetadata: () => $ctrl.manualMetadata,
                            element: () => element
                        },
                        closeCallback: (element) => {
                            //validate data?
                            $ctrl.model[element.index] = element.element;
                            console.log(JSON.stringify($ctrl.model));
                        }
                    });
                    console.log(JSON.stringify($ctrl.model));
                };

                $ctrl.removeAtIndex = (index) => {
                    $ctrl.model.splice(index, 1);
                    $ctrl.metadata.splice();
                };

            }
        });
}());