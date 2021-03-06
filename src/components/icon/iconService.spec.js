describe('mdIcon service', function() {

  var $mdIcon;
  var $httpBackend;
  var $scope;
  var $mdIconProvider;

  beforeEach(module('material.core'));
  beforeEach(module('material.components.icon',function(_$mdIconProvider_){
    $mdIconProvider = _$mdIconProvider_;
    $mdIconProvider
      .icon('android'     , 'android.svg')
      .icon('c2'          , 'c2.svg')
      .icon('notfound'    ,'notfoundicon.svg')
      .iconSet('social'   , 'social.svg' )
      .iconSet('notfound' , 'notfoundgroup.svg' )
      .defaultIconSet('core.svg');
  }));

  beforeEach(inject(function($templateCache, _$httpBackend_, _$mdIcon_, $rootScope){
    $mdIcon = _$mdIcon_;
    $httpBackend = _$httpBackend_;
    $scope = $rootScope;
    $templateCache.put('android.svg', '<svg><g id="android"></g></svg>');
    $templateCache.put('social.svg' , '<svg><g id="s1"></g><g id="s2"></g></svg>');
    $templateCache.put('core.svg'   , '<svg><g id="c1"></g><g id="c2" class="core"></g></svg>');
    $templateCache.put('c2.svg'     , '<svg><g id="c2" class="override"></g></svg>');

    $httpBackend.whenGET('notfoundgroup.svg').respond(404, 'Cannot GET notfoundgroup.svg');
    $httpBackend.whenGET('notfoundicon.svg').respond(404, 'Cannot GET notfoundicon.svg');

  }));

  describe('should configure fontSets',function() {

    it('with Material Icons by default', function () {
      expect($mdIcon.fontSet()).toBe('material-icons');
    });

    it('with register multiple font-sets', function () {

      $mdIconProvider.defaultFontSet('fontawesome');
      $mdIconProvider.fontSet('mi', 'material-icons');
      $mdIconProvider.fontSet('ic', 'icomoon');

      expect($mdIcon.fontSet()).toBe('fontawesome');
      expect($mdIcon.fontSet('mi')).toBe('material-icons');
      expect($mdIcon.fontSet('ic')).toBe('icomoon');
    });

  });

  describe('when using SVGs and ', function () {

    describe('$mdIcon() is passed an icon ID', function() {

      it('should append configured SVG single icon', function() {
        var expected = updateDefaults('<svg><g id="android"></g></svg>');
        $mdIcon('android').then(function(el) {
          expect(el.outerHTML).toEqual(expected);
        });
        $scope.$digest();
      });

      it('should append configured SVG icon from named group', function() {
        var expected = updateDefaults('<svg xmlns="http://www.w3.org/2000/svg"><g id="s1"></g></g></svg>');
        $mdIcon('social:s1').then(function(el) {
          expect(el.outerHTML).toEqual(expected);
        });
        $scope.$digest();
      });

      it('should append configured SVG icon from default group', function() {
        var expected = updateDefaults('<svg xmlns="http://www.w3.org/2000/svg"><g id="c1"></g></g></svg>');
        $mdIcon('c1').then(function(el) {
          expect(el.outerHTML).toEqual(expected);
        });
        $scope.$digest();
      });

      it('should allow single icon defs to override those defined in groups', function() {
        $mdIcon('c2').then(function(el) {
          var list = el.querySelector('g').classList;

          if ( list ) {
            // classList is a part of HTMLElement, but isn't available for SVGElement
            expect(list.contains('override')).toBe(true);
          }

        });

        $scope.$digest();
      });

    });

    describe('$mdIcon() is passed a URL', function() {

      it('should return correct SVG markup', function() {
        $mdIcon('android.svg').then(function(el) {
          expect(el.outerHTML).toEqual( updateDefaults('<svg><g id="android"></g></svg>') );
        })
        $scope.$digest();
      });

    });

    describe('icon set URL is not found', function() {
      it('should log Error', function() {
        var msg;
        try {
          $mdIcon('notconfigured')
            .catch(function(error){
              msg = error;
            });

          $scope.$digest();
        } finally {
          expect(msg).toEqual('icon $default:notconfigured not found');
        }
      });
    });

    describe('icon group is not found', function() {
      it('should log Error', function() {
        var msg;
        try {
          $mdIcon('notfound:someIcon')
            .catch(function(error){
              msg = error;
            });

          $httpBackend.flush();
        } finally {
          expect(msg).toEqual('Cannot GET notfoundgroup.svg');
        }
      });
    });

    describe('icon is not found', function() {
      it('should not throw Error', function() {
        expect(function(){
          $mdIcon('notfound');

          $httpBackend.flush();
        }).not.toThrow();
      });
    });
  });

  function updateDefaults(svg) {
    svg = angular.element(svg)[0];

    angular.forEach({
      'xmlns' : 'http://www.w3.org/2000/svg',
      'fit'   : '',
      'height': '100%',
      'width' : '100%',
      'preserveAspectRatio': 'xMidYMid meet',
      'viewBox' : svg.getAttribute('viewBox') || '0 0 24 24'
    }, function(val, attr) {
      svg.setAttribute(attr, val);
    }, this);

    angular.forEach({
      'pointer-events' : 'none',
      'display' : 'block'
    }, function(val, style) {
      svg.style[style] = val;
    }, this);

    return svg.outerHTML;
  }

});
