// Compiled using marko@4.23.9 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/scan-scanner-and-printers$1.0.0/views/lista/lista.marko",
    marko_renderer = require("marko/src/runtime/components/renderer"),
    marko_forOf = require("marko/src/runtime/helpers/for-of"),
    helpers_escape_xml = require("marko/src/runtime/html/helpers/escape-xml"),
    marko_escapeXml = helpers_escape_xml.x,
    marko_classAttr = require("marko/src/runtime/html/helpers/class-attr"),
    marko_attr = require("marko/src/runtime/html/helpers/attr"),
    marko_loadTag = require("marko/src/runtime/helpers/load-tag"),
    init_components_tag = marko_loadTag(require("marko/src/core-tags/components/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/core-tags/core/await/reorderer-renderer")),
    _preferred_script_location_tag = marko_loadTag(require("marko/src/core-tags/components/preferred-script-location-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<html><head><meta charset=utf-8><link rel=stylesheet type=text/css href=/estatico/css/lista.css></head><body><header class=cabecalhoPrincipal><div class=container><div class=\"row align-items-center\"><div class=\"cabecalhoPrincipal-navegacao col-8\"></div></div></div></header><main class=conteudoPrincipal><div class=container><h1>Impressoras ");

  if (data.offline == "true") {
    out.w("Offline");
  }

  out.w("</h1><table id=livros class=\"table table-striped table-hover\"><thead class=thead-dark><tr><th>Empresa</th><th>Fabricante</th><th>Modelo</th><th>Número de Série</th><th>Ponto</th><th>IP da Máquina</th><th>Ultima Comunicação</th>");

  if (data.offline == "true") {
    out.w("<th>Status</th><th>Observações</th>");
  }

  out.w("</tr></thead><tbody>");

  var $for$0 = 0;

  marko_forOf(data.impressoras, function(impressora) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    out.w("<tr" +
      marko_classAttr("status_" + impressora.scan_status) +
      marko_attr("id", "impressora_" + (impressora.id == null ? "" : impressora.id)) +
      "><td>" +
      marko_escapeXml(impressora.customer_name) +
      "</td><td>" +
      marko_escapeXml(impressora.manufacturer) +
      "</td><td>" +
      marko_escapeXml(impressora.model) +
      "</td><td>" +
      marko_escapeXml(impressora.serialNumber) +
      "</td><td>" +
      marko_escapeXml(impressora.installationPoint) +
      "</td>");

    if (impressora.tipo_conexao == "usb") {
      out.w("<td>USB</td>");
    } else if (impressora.tipo_conexao == "network") {
      out.w("<td>" +
        marko_escapeXml(impressora.ipAddress) +
        "</td>");
    }

    out.w("<td>" +
      marko_escapeXml(impressora.lastCommunication) +
      "</td>");

    if (data.offline == "true") {
      out.w("<td>" +
        marko_escapeXml(impressora.scan_observation) +
        "</td>");
    }

    out.w("</tr>");
  });

  out.w("</tbody></table></div></main>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "35");

  _preferred_script_location_tag({}, out);

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    id: "/scan-scanner-and-printers$1.0.0/views/lista/lista.marko",
    tags: [
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer",
      "marko/src/core-tags/components/preferred-script-location-tag"
    ]
  };
