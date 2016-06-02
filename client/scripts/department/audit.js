'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$scope', '$q', 'Department.Audit.Service.Http',
  function($scope, $q, Http) {
    $scope.InfoResource = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getAuditList(_httpParams);
    }

    // init
    getAuditList();

    function getAuditList() {
      $scope.auditPromise = Http.getAuditList(_httpParams).then(function(result) {
        $scope.auditList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }

    $scope.searchInfoResourceByName = function() {
      _httpParams.quota_name = $scope.InfoResource.resource_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList();
    }


  }
])


Audit.controller('Department.Audit.Controller.info', ['$scope', '$state', '$q', 'Department.Audit.Service.Http', '$stateParams',
  function( $scope, $state, $q, Http, $stateParams) {
    $scope.TabItemShow = true;
    $scope.TabRequireShow = true;
    $scope.AuditInfo = {};
    $scope.AuditInfo.audit_opinion = '';

    // get audit detail by id
    Http.getQuotaDetail({
      data_quota_id: $stateParams.DATAQUOTAID
    }).then(function(result) {
      $scope.AuditDetail = result.data.body[0];
      $scope.AuditDetail.applydepname = $stateParams.APPLYDEPNAME;
      $scope.AuditDetail.applytime = $stateParams.APPLYTIME;
      console.log($scope.AuditDetail);
    })


    $scope.submitAudit = function() {
      console.log($scope.AuditInfo.audit_status);
      if(!$scope.AuditInfo.audit_status) {
        $scope.auditError = true;
        return;
      }
      $scope.AuditInfo.ID = $stateParams.AUDITID;
      Http.updateAuditDetail($scope.AuditInfo).then(function(result) {
        if (200 == result.data.head.status) {
          alert('审核成功');
          $state.go("main.department.audit", {}, {
            reload: true
          });
        } else {
          alert('审核失败');
        }
      });
    }
  }
])

/* HTTP */
Audit.factory('Department.Audit.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getAuditList(params) {
      return $http.get(
        path + '/opendata_quotalist', {
          params: params
        }
      )
    }

    function getQuotaDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function updateAuditDetail(data) {
      return $http.put(
        path + '/data_quota_apply_info', {
          data: data
        }
      )
    }

    function getQuotaRequirement(params) {
      return $http.get(
        path + '/requiement_detail', {
          params: params
        }
      )
    }
    return {
      getAuditList: getAuditList,
      getQuotaDetail: getQuotaDetail,
      updateAuditDetail: updateAuditDetail,
      getQuotaRequirement: getQuotaRequirement
    }
  }
]);
