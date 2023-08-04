/**
 * CÓDIGO JAVASCRIPT DE LA PÁGINA DE VENTAS
 *
 * ---
 *
 * Notar que esta solución puede tener algún detalle extra, que no se haya
 * visto en clase (ej: la parte de "Filters" en Vue.js).
 *
 * Como dice el dicho:
 * "No se mareen con los árboles, intenten ver el bosque". Intenten quedarse
 * con lo más importante, con lo esencial.
 *
 * A su vez, también puede suceder que agregando algún concepto teórico extra,
 * algunas partes de este proyecto se podrían haber resuleto de una forma más
 * elegante. Intentamos dejarlo lo más simple posible, tomando en cuenta la
 * etapa de aprendizaje en la que se encuentran.
 *
 * ¡Muchos éxitos en lo que se viene! 💪
 *
 */

// OBJETO (Instancia) de VUE:
var salesApp = new Vue({
  el: "#sales",
  data: {
    cars: [], // Lista de autos. Inicialmente vacía.
    currency: "USD", // Atributo que indica la moneda seleccionada.
    exchangeRateUYU: 0,
    brands: [], // Lista de marcas. Inicialmente vacía.
    brandSelected: "",
    models: [], // Lista de modelos. Inicialmente vacía.
    modelSelected: "",
    years: [], // Lista de años. Inicialmente vacía.
    yearSelected: "",
    statusSelected: "",
    filtering: false, // Atributo booleano que indica si se están filtando los autos.
    showAlert: false,
  },
  filters: {
    // Documentación de Vue.js sobre Filtros:
    // https://vuejs.org/v2/guide/syntax.html#Filters
    // ⚠️ Para este curso, esto de lo filtros es un detalle menor, un extra (avanzado).
    thousands: function (value) {
      // Documentación de JavaScript sobre toLocaleString:
      // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
      return parseInt(value).toLocaleString("es-UY");
    },
  },
});

// CARGA DE AÑOS:
for (var i = 2022; i >= 1900; i--) {
  salesApp.years.push(i);
}

/**
 * CARGA DE TIPO DE CAMBIO.
 *
 * Esta llamada HTTP sólo se realiza una vez (al cargar la página).
 */
fetch("https://ha-front-api-proyecto-final.vercel.app/rates")
  .then(function (data) {
    return data.json();
  })
  .then(function (data) {
    salesApp.exchangeRateUYU = data.uyu;
  });

/**
 * CARGA DE MARCAS.
 *
 * Esta llamada HTTP sólo se realiza una vez (al cargar la página).
 */
fetch("https://ha-front-api-proyecto-final.vercel.app/brands")
  .then(function (data) {
    return data.json();
  })
  .then(function (data) {
    salesApp.brands = data;
  });

/**
 * CARGA DE MODELOS.
 *
 * Detección del evento "change" en el <select> de marcas.
 * Cada vez que se cambia una marca, se actualiza la lista de modelos.
 *
 * Nota: para detectar eventos también se podría haber usado Vue.js
 * (en lugar de JS "puro"), y de hecho sería aconsejable hacerlo así.
 * Documentación: https://v2.vuejs.org/v2/guide/events.html.
 */
document.querySelector("#select-brand").addEventListener("change", function () {
  var url =
    "https://ha-front-api-proyecto-final.vercel.app/models?brand=" +
    salesApp.brandSelected;

  fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      salesApp.models = data;
      salesApp.modelSelected = "";
    });
});

/**
 * FILTRO DE AUTOS.
 *
 * Detección del evento "click" en el botón "filtrar".
 * Cada vez que se hace click, se cargan los autos vía AJAX.
 *
 * Nota: para detectar eventos también se podría haber usado Vue.js
 * (en lugar de JS "puro"), y de hecho sería aconsejable hacerlo así.
 * Documentación: https://v2.vuejs.org/v2/guide/events.html.
 */
document.querySelector("#btn-filter").addEventListener("click", function () {
  loadCars();
});

/**
 * CAMBIAR MONEDA.
 *
 * Detección del evento "click" en el botón "cambiar moneda".
 *
 * Nota: para detectar eventos también se podría haber usado Vue.js
 * (en lugar de JS "puro"), y de hecho sería aconsejable hacerlo así.
 * Documentación: https://v2.vuejs.org/v2/guide/events.html.
 */
document.querySelector("#btn-currency").addEventListener("click", function () {
  if (salesApp.currency === "USD") {
    salesApp.currency = "UYU";
  } else {
    salesApp.currency = "USD";
  }
});

/**
 * CARGA DE AUTOS.
 *
 * Esta función se llamará tanto al cargar la página por primera vez,
 * como también cada vez que el usuario haga click en el botón "filtrar".
 */
function loadCars() {
  salesApp.filtering = true;

  var year = salesApp.yearSelected; // Shortcut.
  var brand = salesApp.brandSelected; // Shortcut.
  var model = salesApp.modelSelected; // Shortcut.
  var status = salesApp.statusSelected; // Shortcut.

  var url = `https://ha-front-api-proyecto-final.vercel.app/cars?year=${year}&brand=${brand}&model=${model}&status=${status}`;

  fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      salesApp.filtering = false;
      salesApp.cars = data;
      salesApp.showAlert = true;
      // document.querySelector(".alert-warning").classList.remove("d-none");
    });
}

// Carga inicial de autos:
loadCars();
