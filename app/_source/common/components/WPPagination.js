/**
    example :
    
    in parent controller:
    
    $scope.page = {
            "pageNumber" : 1,
            "pageSize" : 10        
    };

    Ajax response
    $scope.conditionSearch = function(){
    resource.get(params,function(data){
            if(data.returnCode === '0'){                    
                $scope.transactions = data.data.list;
                $scope.totalPage = data.data.totalPage;         //This is need
                $scope.currentPage = data.data.currentPage;     //This is need
                $scope.pageSize = data.data.pageSize;           //This is need
            }
    });

    } 

    In HTML template
    paging-action is the function of fetch data in your Controller
    <div class="pagination right" 
        wp-pagination current-page="currentPage" page-size="pageSize" 
        total-page="totalPage" paging-action="conditionSearch()" 
        page="page"></div>
*/

webapp.directive('wpPagination', function () {
    function _init(scope, attrs) {
        scope.List = [];
        scope.Hide = false;
        scope.dots = scope.dots || '...';
        scope.currentPage = +scope.currentPage || 1;
        scope.totalPage = +scope.totalPage || 0;
        scope.ulClass = scope.ulClass || 'pagination';
        scope.adjacent = +scope.adjacent || 2;
        scope.activeClass = scope.activeClass || 'active';
        scope.disabledClass = scope.disabledClass || 'disabled';
        scope.hideIfEmpty = false;
        scope.showPrevNext = scope.$eval(attrs.showPrevNext) || true;
    }
    function _validate(scope, pageCount) {
        if (scope.currentPage > pageCount) {
            scope.currentPage = pageCount;
        }
        if (scope.currentPage <= 0) {
            scope.currentPage = 1;
        }
        if (scope.adjacent <= 0) {
            scope.adjacent = 2;
        }
        if (pageCount <= 1) {
            scope.Hide = scope.hideIfEmpty;
        }
    }

    function addPrevNext(scope, pageCount, mode){
        if (!scope.showPrevNext || pageCount < 1) { return; }
        var disabled,linkItem;
        if(mode === 'prev') {
            disabled = scope.currentPage - 1 <= 0;
            var prevPage = scope.currentPage - 1 <= 0 ? 1 : scope.currentPage - 1;
            linkItem = {
             value: "<", 
             title: 'Previous',
             page: prevPage,
             liClass: disabled ? scope.disabledClass + ' prev' : 'prev'
            };
        } else {
            disabled = scope.currentPage + 1 > pageCount;
            var nextPage = scope.currentPage + 1 >= pageCount ? pageCount : scope.currentPage + 1;
            linkItem = { 
                value : ">", 
                title: 'Next',
                page: nextPage,
                liClass: disabled ? scope.disabledClass + ' next' : 'next'
            };
        }
        scope.List.push(linkItem);
    }

    function addRange(start, finish, scope) {
        var i = 0;
        for (i = start; i <= finish; i++) {
            var item = {
                value: i,
                title: i,
                liClass: scope.currentPage === i ? scope.activeClass : ''
            };
            scope.List.push(item);
        }
    }

    function addDots(scope) {
        scope.List.push({
            title: scope.dots
        });
    }

    function addFirst(scope, next) {
        addRange(1, 2, scope);
        if(next !== 3){
            addDots(scope);
        }
    }

    function addLast(pageCount, scope, prev) {
        if(prev !== pageCount - 2){
            addDots(scope);
        }
        addRange(pageCount - 1, pageCount, scope);
    }


    function build(scope, attrs) {
        if (!scope.pageSize || scope.pageSize <= 0) { scope.pageSize = 1; }
        var totalPage = scope.totalPage;
        _init(scope, attrs);
        _validate(scope, totalPage);
        var start, finish;
        var fullAdjacentSize = (scope.adjacent * 2) + 2;
        addPrevNext(scope, totalPage, 'prev');
        if (totalPage <= (fullAdjacentSize + 2)) {
            start = 1;
            addRange(start, totalPage, scope);
        } else {
            if (scope.currentPage - scope.adjacent <= 2) {
                start = 1;
                finish = 1 + fullAdjacentSize;
                addRange(start, finish, scope);
                addLast(totalPage, scope, finish);
            }
            else if (scope.currentPage < totalPage - (scope.adjacent + 2)) {
                start = scope.currentPage - scope.adjacent;
                finish = scope.currentPage + scope.adjacent;
                addFirst(scope, start);
                addRange(start, finish, scope);
                addLast(totalPage, scope, finish);
            }
            else {
                start = totalPage - fullAdjacentSize;
                finish = totalPage;
                addFirst(scope, start);
                addRange(start, finish, scope);
            }
        }
        addPrevNext(scope, totalPage, 'next');
        scope.gotoPage = function(page){
            var currentPage = scope.page.pageNumber;
            if(page === '<'){
                if(currentPage === 1){
                    return;
                }
               scope.page.pageNumber = currentPage - 1;
            }else if(page === '>'){
                if(scope.totalPage === currentPage){
                    return;
                }
               scope.page.pageNumber = currentPage + 1;
            }else{
                scope.page.pageNumber = page;
            }
            scope.pagingAction();
        };
    }


    return {
        restrict: 'EA',
        scope: {
            currentPage: '=',
            pageSize: '=',
            totalPage: '=',
            page:'=',
            dots: '@',
            hideIfEmpty: '@',
            ulClass: '@',
            activeClass: '@',
            disabledClass: '@',
            adjacent: '@',
            showPrevNext: '@',
            pagingAction: '&'
        },
        template:
            '<a href="javascript:;" ng-class="Item.liClass" ng-click="gotoPage(Item.value)" ng-repeat="Item in List">{{Item.title}}</a>',
        link: function (scope, element, attrs) {
            scope.$watchCollection('[currentPage,pageSize,totalPage,page]', function () {
                build(scope, attrs);
            });
        }
    };
});