define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this,
      system = self.system(),
      langs = self.langs;

    this.callbacks = {
      init: function () {
        var settings = self.get_settings();
        if (
          $('link[href="' + settings.path + '/style.css?v=' + settings.version + '"]').length < 1
        ) {
          $('head').append(
            '<link href="' +
              settings.path +
              'style.css?v=' +
              settings.version +
              '" type="text/css" rel="stylesheet">',
          );
        }
        return true;
      },
      render: function () {
        var selected = self.list_selected().selected[0];

        if (!selected) return;
        var { id, ...rest } = selected;

        var newDeal = {
          name: (selected.name || 'Сделка') + ' (копия)',
          ...rest,
          original_id: id,
        };

        self.crm_post(
          '/api/v4/leads/complex',
          { add: [newDeal] },
          function (response) {
            self.render_template({
              body: `<div class="widget-message">
               Скопированная сделка успешно создана: ID ${response._embedded['leads'][0].id}
             </div>`,
            });
          },
          function (err) {
            self.render_template({
              body: `<div class="widget-error">
               Ошибка при создании сделки: ${err.statusText}
             </div>`,
            });
          },
        );
      },
      bind_actions: function () {
        return true;
      },
    };

    return this;
  };
  return CustomWidget;
});
