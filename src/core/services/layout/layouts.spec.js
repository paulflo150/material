describe('layouts service', function () {
    var $mdUtil;

    beforeEach(module('material.layouts'));

    beforeEach(inject(function (_$mdUtil_) {
        $mdUtil = _$mdUtil_;
    }));

    describe('expecting layout classes', function () {

        var suffixes = ['sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg'];

        var directionValues = ['row', 'column'];
        var flexValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 33, 34, 66, 67];
        var alignmentValues = ['center', 'center center', 'center start', 'center end',
                           'end', 'end-center', 'end start', 'end end',
                           'space-around', 'space-around center', 'space-around start', 'space-around end',
                           'space-between', 'space-between center', 'space-between start', 'space-between end',
                           'center center', 'start center', 'end center', 'space-between center', 'space-around center',
                           'center start', 'start start', 'end start', 'space-between start', 'space-around start',
                           'center end', 'start end', 'end end', 'space-between end', 'space-around end'];
        var flexOrderValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var offsetValues = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 33, 34, 66, 67];

        var mappings = [
                { attribute: 'layout', suffixes: suffixes, values: directionValues, addDirectiveAsClass: true, testStandAlone: true },
                { attribute: 'layout-align', suffixes: suffixes, values: alignmentValues },
                { attribute: 'layout-padding', testStandAlone: true },
                { attribute: 'layout-margin', testStandAlone: true },
                { attribute: 'layout-wrap', testStandAlone: true },
                { attribute: 'layout-fill', testStandAlone: true },

                { attribute: 'flex', suffixes: suffixes, values: flexValues, addDirectiveAsClass: true, testStandAlone: true },
                { attribute: 'flex-order', suffixes: suffixes, values: flexOrderValues },

                { attribute: 'offset', suffixes: suffixes, values: offsetValues },

                { attribute: 'hide', suffixes: suffixes, testStandAlone: true },
                { attribute: 'show', suffixes: suffixes, testStandAlone: true }
        ];

        for (var i = 0; i < mappings.length; i++) {
            var mapping = mappings[i];
            // First test the mapping without any suffixes or values.
            if (mapping.testStandAlone)
                testMapping(mapping.attribute, mapping.attribute);
            // Check for suffixes.
            if (mapping.suffixes)
                testWithSuffix(mapping.attribute, mapping.suffixes, mapping.values, mapping.testStandAlone, mapping.addDirectiveAsClass);
            // Check for values.
            if (mapping.values)
                testWithSuffixAndValue(mapping.attribute, mapping.values, undefined, mapping.addDirectiveAsClass);
        }


        function testMapping(attribute, expectedClass) {
            it('should fail if the class ' + expectedClass + ' was not added for attribute ' + attribute, inject(function ($compile, $rootScope) {                
                var element = $compile('<div ' + attribute + '>Layout</div>')($rootScope);
                expect(element.hasClass(expectedClass)).toBe(true);
            }));
        }

        function testMappingWithSuffixAndValue(attribute, value, addDirectiveAsClass) {
            it('should fail if the attribute ' + attribute + ' with a value of ' + value + ' does not have the required classes', inject(function ($compile, $rootScope) {
                var attr = buildAttributeWithValue(attribute, value);
                var expectedClass = buildExpectedClass(attribute, value, addDirectiveAsClass);
                var element = $compile('<div ' + attr + '>Layout</div>')($rootScope);
                expect(element.hasClass(expectedClass)).toBe(true);
            }));
        }

        function testWithSuffix(attribute, suffixes, values, testStandAlone, addDirectiveAsClass) {
            for (var j = 0; j < suffixes.length; j++) {
                var suffix = suffixes[j];
                // Add the suffix to the attribute.
                var attributeWithValue = attribute + '-' + suffix;
                // Add the suffix to the expected class.
                var expectedClass = attribute + '-' + suffix;
                // Run the test.
                if (testStandAlone)
                    testMapping(attributeWithValue, expectedClass);
                // Add suffixes with values.
                if (values)
                    testWithSuffixAndValue(attribute, values, suffix, addDirectiveAsClass);
            };
        }

        function testWithSuffixAndValue(attribute, values, suffix, addDirectiveAsClass) {

            for (var j = 0; j < values.length; j++) {
                var value = values[j].toString();
                var attr = suffix ? attribute + '-' + suffix : attribute;

                //var attrWithValue = buildAttributeWithValue(attr, value);
                //var expectedClass = buildExpectedClass(attr, value);

                // Run each test.
                testMappingWithSuffixAndValue(attr, value, addDirectiveAsClass);
            }
        }

        /**
        * Build string of expected classes that should be added to the 
        * DOM element.
        *
        * Convert directive with value to classes
        *
        * @param attrClass String full attribute name; eg 'layout-gt-lg'
        * @param attrValue String HTML directive; eg "column"
        * 
        * @returns String to be used with element.addClass(...); eg  `layout-gt-lg layout-gt-lg-column`
        */
        function buildExpectedClass(attrClass, attrValue, addDirectiveAsClass) {
            if (addDirectiveAsClass) attrClass += ' ' + attrClass;
            return $mdUtil.supplant('{0}-{1}', [attrClass, attrValue.replace(/\s+/g, "-")]);
            //return attrClass + '-' + attrValue.replace(/\s+/g, "-");
        }

        /**
         * Build full string of expected directive with its value
         * Note: The expected class always starts with the
         *     attribute name, add the suffix if any.
         *
         * @param attrClass String full attribute name; eg 'layout-gt-lg'
         * @param attrValue String HTML directive; eg "column"
         * 
         * @returns String like `layout-gt-lg="column"`
         */
        function buildAttributeWithValue(attr, value) {
            return $mdUtil.supplant('{0}="{1}"', [attr, value]);
            //return attr + '="' + value + '"';
        }
    });
});
