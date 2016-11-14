angular.module('toRest.filters')

.filter('arrayLabel', function() {
  return function(items, labels) {
    if (! labels) {
      return '';
    }

    if (items.map) {
      return items.map(function(item_id) {
        return labels[item_id]
      }).join(', ');  
    } else {
      return '';
    }
  }
});