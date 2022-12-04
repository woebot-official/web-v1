type = ['primary', 'info', 'success', 'warning', 'danger'];
icons = ['fas fa-ruble-sign','fas fa-info','fas fa-check-circle','fas fa-exclamation-triangle','fas fa-times'];
titles = ['<strong>Tip</strong>','<strong>Info</strong>','<strong>Sucess</strong>','<strong>Warning</strong>','<strong>Danger</strong>'];
woebot = {
  showNotification: function(i, from, align, msg) {
    $.notify({
      icon: icons[i],
      title: titles[i],
      message: msg

    }, {
      type: type[i],
      timer: 8000,
      placement: {
        from: from,
        align: align
      }
    });
  }

};