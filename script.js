"use strict";

/**
 * Cleaning Profit Calculator
 *
 * The configuration, calculation engine, storage adapters, and DOM rendering
 * are intentionally separated. A future calculator can reuse the pricing
 * engine with different labels, defaults, and service multipliers.
 */

const APP_CONFIG = Object.freeze({
  appName: "Cleaning Profit Calculator",
  defaultLanguage: "en",
  supportedLanguages: ["en", "es"],
  // Currency formatting remains en-US/USD and is independent from UI language.
  locale: "en-US",
  currency: "USD",
  weeksPerMonth: 4.33,
  // Launch offer settings: update these values in one place.
  commercialOffer: {
    productName: {
      en: "Personalized Pricing Setup",
      es: "Configuración Personalizada de Precios",
    },
    priceUsd: 19,
    // Paste the Gumroad (or other checkout) URL here when it is ready.
    purchaseUrl: "",
  },
  storage: {
    calculator: "cleaningProfitCalculator:v1:inputs",
    monthlyGoal: "cleaningProfitCalculator:v1:monthlyGoal",
    earlyAccess: "cleaningProfitCalculator:v1:earlyAccessEmails",
    language: "cleaningProfitCalculator:v1:language",
  },
  limits: {
    maxSafeInput: 100_000_000,
  },
  // Change, add, or remove service types here. No formula changes are needed.
  serviceTypes: [
    { id: "standard", labelKey: "serviceStandard", multiplier: 1.0 },
    { id: "deep", labelKey: "serviceDeep", multiplier: 1.3 },
    { id: "move", labelKey: "serviceMove", multiplier: 1.4 },
    { id: "airbnb", labelKey: "serviceAirbnb", multiplier: 1.15 },
    { id: "commercial", labelKey: "serviceCommercial", multiplier: 1.2 },
    { id: "custom", labelKey: "serviceCustom", multiplier: 1.0 },
  ],
  defaults: {
    serviceType: "standard",
    propertySize: 1500,
    bedrooms: 3,
    bathrooms: 2,
    hourlyWage: 22,
    workers: 2,
    hours: 3,
    supplies: 18,
    travel: 12,
    parking: 0,
    jobEquipment: 5,
    otherVariable: 0,
    insurance: 120,
    software: 35,
    phone: 70,
    marketing: 150,
    vehicle: 400,
    monthlyEquipment: 100,
    office: 0,
    otherMonthly: 50,
    jobsPerMonth: 40,
    paymentFee: 3,
    desiredMargin: 30,
  },
  goalDefaults: {
    monthlyProfitGoal: 5000,
    averageProfitPerJob: 0,
  },
});

const TRANSLATIONS = Object.freeze({
  en: {
    metaTitle: "Cleaning Business Pricing Calculator | Cleaning Profit Calculator",
    metaDescription: "Free cleaning business pricing calculator. Calculate job costs, break-even pricing, profit margins, and the right price to charge for cleaning services.",
    ogTitle: "Cleaning Business Pricing Calculator | Cleaning Profit Calculator",
    ogDescription: "Calculate cleaning job costs, break-even pricing, profit margins, and a recommended customer price—for free.",
    appName: "Cleaning Profit Calculator",
    brandHomeAria: "Cleaning Profit Calculator home",
    languageSelectorAria: "Language",
    benefitsAria: "Calculator benefits",
    openCalculator: "Open calculator",
    heroEyebrow: "Built for independent cleaning businesses",
    heroTitle: "Know exactly what to charge for every cleaning job.",
    heroDescription: "Turn your real labor, supplies, overhead, and payment fees into a confident price that protects your profit.",
    calculateMyPrice: "Calculate My Price",
    benefitNoSignup: "No sign-up",
    benefitFree: "Free to use",
    benefitLocal: "Your data stays on this device",
    priceShouldCover: "What your price should cover",
    liveEstimate: "Live estimate",
    labor: "Labor",
    coreCost: "Core cost",
    materialsTravel: "Materials + travel",
    directCost: "Direct cost",
    businessOverhead: "Business Overhead",
    perJob: "Per job",
    yourProfit: "Your profit",
    protected: "Protected",
    goodPricing: "Good pricing pays the business and the owner.",
    calculatorEyebrow: "Your numbers, made simple",
    calculatorTitle: "Build a profitable quote",
    calculatorDescription: "Enter your best estimates. Your pricing breakdown updates automatically as you make changes.",
    jobDetails: "Job Details",
    jobDetailsDescription: "Choose the service type and add optional property details for reference.",
    serviceType: "Service type",
    propertySize: "Property size",
    unitSqFt: "sq ft",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    optionalJobContext: "Optional job context",
    propertyContext: "Property details are saved as reference for the quote. Pricing is based on the labor time and actual business costs you enter below.",
    laborDescription: "Include a fair hourly wage—even when you do the work yourself.",
    hourlyWage: "Hourly wage per worker",
    workers: "Number of workers",
    estimatedHours: "Estimated cleaning hours",
    unitHours: "hrs",
    laborCost: "Labor Cost",
    laborFormulaShort: "Wage × workers × hours",
    materialsVariable: "Materials & Variable Costs",
    materialsDescription: "Add every expense that changes from job to job.",
    cleaningSupplies: "Cleaning supplies",
    travelFuel: "Travel / fuel",
    parking: "Parking",
    jobEquipment: "Equipment allocated to this job",
    otherVariable: "Other variable costs",
    totalVariableCosts: "Total Variable Costs",
    overheadDescription: "Spread recurring monthly expenses across the jobs you expect to complete.",
    monthlyExpenses: "Monthly expenses",
    insurance: "Insurance",
    software: "Software",
    phone: "Phone",
    marketing: "Marketing",
    vehicle: "Vehicle",
    equipment: "Equipment",
    officeStorage: "Office / storage",
    otherMonthly: "Other monthly expenses",
    expectedJobs: "Expected number of jobs per month",
    monthlyOverhead: "Monthly Overhead",
    overheadPerJob: "Overhead Per Job",
    paymentFees: "Payment Fees",
    paymentFeesDescription: "Card or online payment processing.",
    processingFee: "Payment processing fee",
    desiredProfit: "Desired Profit",
    desiredProfitDescription: "Your target margin on the final price.",
    desiredMargin: "Desired profit margin",
    resetCalculator: "Reset Calculator",
    pricingBreakdown: "Your Pricing Breakdown",
    breakEvenPrice: "Break-Even Price",
    breakEvenWarning: "Charging below this means you are losing money.",
    recommendedPrice: "Recommended Price",
    resultOfferPrompt: "Need help setting your exact rates?",
    resultOfferLink: "Get a personalized pricing setup →",
    estimatedProfit: "Estimated Profit",
    profitMargin: "Profit Margin",
    revenueLaborHour: "Revenue / Labor Hour",
    totalJobCost: "Total Job Cost",
    viewCostBreakdown: "View cost breakdown",
    variableCosts: "Variable costs",
    feeAtRecommended: "Payment fee at recommended price",
    suggestedOptions: "Suggested options",
    pricingPackages: "Pricing Packages",
    packagesDescription: "Use these as starting points for a tiered quote. Adjust the scope of work to match each package.",
    packageBasic: "Basic",
    packageBasicDescription: "About 90% of your recommended price for a lighter scope.",
    recommended: "Recommended",
    packageStandard: "Standard",
    packageStandardDescription: "Your full recommended price for the planned scope.",
    packagePremium: "Premium",
    packagePremiumDescription: "About 120% of your recommended price for added value.",
    packageDisclaimer: "Suggested package prices are rounded for presentation. Confirm that the included services justify each price.",
    offerHeadline: "Want pricing built around your actual business?",
    offerDescription: "Get a personalized pricing setup based on your labor costs, overhead, services and profit goals.",
    offerIncludes: "What your setup includes",
    offerFeatureStructure: "Personalized pricing structure",
    offerFeatureMinimums: "Recommended minimum rates",
    offerFeatureMargins: "Profit-margin targets",
    offerFeatureServices: "Service pricing recommendations",
    offerFeatureOverhead: "Overhead allocation",
    offerFeatureReview: "Pricing review for your current services",
    offerPrice: "{price} Launch Price",
    offerCta: "Get My Personalized Pricing Setup",
    checkoutSoon: "Checkout opening soon",
    goalEyebrow: "Plan beyond the next job",
    goalTitle: "Monthly Goal Calculator",
    goalDescription: "See how many jobs you need to book to reach your monthly profit target.",
    desiredMonthlyProfit: "Desired monthly profit",
    averageProfitJob: "Average profit per job",
    useCurrentEstimate: "Use current estimate",
    jobsMonth: "jobs / month",
    jobsWeek: "jobs / week",
    comingNext: "Coming next",
    advancedTitle: "Want a more advanced version?",
    advancedDescription: "Join the early-access list for future tools designed to help you price, quote, and manage your cleaning business.",
    featureSavedJobs: "Saved jobs",
    featureQuoteGenerator: "Client quote generator",
    featureRecurringPricing: "Recurring cleaning pricing",
    featurePrintableEstimates: "Printable estimates",
    featureCustomRules: "Custom pricing rules",
    featureDashboard: "Business dashboard",
    emailAddress: "Email address",
    optional: "(optional)",
    emailPlaceholder: "you@business.com",
    getEarlyAccess: "Get Early Access",
    leadPrivacy: "Prototype only: your email is saved on this device and is not sent to a server.",
    disclaimer: "This calculator provides pricing estimates for educational and business planning purposes. Actual costs, taxes, wages and business expenses may vary.",
    saved: "Saved",
    resultUnavailable: "Add valid labor, overhead, and pricing targets to see your quote.",
    laborError: "Enter an hourly wage, at least one worker, and cleaning hours greater than zero.",
    overheadError: "Expected jobs per month must be at least 1.",
    targetError: "Desired margin and payment fee must add up to less than 100%.",
    goalError: "Enter a monthly goal and average profit greater than $0.",
    localLeadSuccess: "Saved on this device only. Nothing was sent to a server.",
    leadRequired: "Enter an email address to save your interest on this device.",
    leadInvalid: "Enter a valid email address.",
    leadStorageError: "This browser could not save the email locally. Nothing was sent.",
    serviceMultiplierHelp: "{service} uses a {multiplier}× complexity multiplier.",
    recommendedContext: "{service} · {multiplier}× complexity",
    serviceStandard: "Standard Cleaning",
    serviceDeep: "Deep Cleaning",
    serviceMove: "Move-In / Move-Out Cleaning",
    serviceAirbnb: "Airbnb / Short-Term Rental",
    serviceCommercial: "Commercial Cleaning",
    serviceCustom: "Custom",
  },
  es: {
    metaTitle: "Calculadora de Precios para Negocios de Limpieza | Calculadora de Rentabilidad",
    metaDescription: "Calculadora gratuita de precios para negocios de limpieza. Calcula costos, punto de equilibrio, márgenes y cuánto cobrar por tus servicios.",
    ogTitle: "Calculadora de Precios para Negocios de Limpieza",
    ogDescription: "Calcula gratis los costos, el punto de equilibrio, el margen de utilidad y un precio recomendado para cada trabajo de limpieza.",
    appName: "Calculadora de Rentabilidad para Servicios de Limpieza",
    brandHomeAria: "Inicio de la Calculadora de Rentabilidad para Servicios de Limpieza",
    languageSelectorAria: "Idioma",
    benefitsAria: "Ventajas de la calculadora",
    openCalculator: "Abrir calculadora",
    heroEyebrow: "Creada para pequeños negocios de limpieza",
    heroTitle: "Calcula con precisión cuánto cobrar por cada servicio de limpieza.",
    heroDescription: "Convierte tus costos reales de mano de obra, insumos, gastos fijos y comisiones de pago en un precio rentable y seguro.",
    calculateMyPrice: "Calcular mi precio",
    benefitNoSignup: "Sin registro",
    benefitFree: "Uso gratuito",
    benefitLocal: "Tus datos permanecen en este dispositivo",
    priceShouldCover: "Lo que debe cubrir tu precio",
    liveEstimate: "Estimación en tiempo real",
    labor: "Mano de obra",
    coreCost: "Costo principal",
    materialsTravel: "Materiales + traslado",
    directCost: "Costo directo",
    businessOverhead: "Gastos Fijos del Negocio",
    perJob: "Por trabajo",
    yourProfit: "Tu utilidad",
    protected: "Protegida",
    goodPricing: "Un buen precio sostiene al negocio y remunera al dueño.",
    calculatorEyebrow: "Tus números, sin complicaciones",
    calculatorTitle: "Crea una cotización rentable",
    calculatorDescription: "Ingresa tus mejores estimaciones. El desglose del precio se actualiza automáticamente con cada cambio.",
    jobDetails: "Detalles del Trabajo",
    jobDetailsDescription: "Elige el tipo de servicio y añade datos opcionales de la propiedad como referencia.",
    serviceType: "Tipo de servicio",
    propertySize: "Tamaño de la propiedad",
    unitSqFt: "sq ft",
    bedrooms: "Dormitorios",
    bathrooms: "Baños",
    optionalJobContext: "Contexto opcional del trabajo",
    propertyContext: "Los datos de la propiedad se guardan como referencia para la cotización. El precio se basa en el tiempo de trabajo y los costos reales del negocio que ingreses a continuación.",
    laborDescription: "Incluye un pago por hora justo, incluso si tú realizas el trabajo.",
    hourlyWage: "Pago por hora de cada trabajador",
    workers: "Número de trabajadores",
    estimatedHours: "Horas estimadas de limpieza",
    unitHours: "h",
    laborCost: "Costo de Mano de Obra",
    laborFormulaShort: "Pago por hora × trabajadores × horas",
    materialsVariable: "Materiales y Costos Variables",
    materialsDescription: "Añade cada gasto que cambie de un trabajo a otro.",
    cleaningSupplies: "Insumos de limpieza",
    travelFuel: "Traslado / combustible",
    parking: "Estacionamiento",
    jobEquipment: "Costo de equipos asignado a este trabajo",
    otherVariable: "Otros costos variables",
    totalVariableCosts: "Total de Costos Variables",
    overheadDescription: "Distribuye los gastos mensuales recurrentes entre los trabajos que esperas completar.",
    monthlyExpenses: "Gastos mensuales",
    insurance: "Seguro",
    software: "Software",
    phone: "Teléfono",
    marketing: "Marketing",
    vehicle: "Vehículo",
    equipment: "Equipos",
    officeStorage: "Oficina / almacenamiento",
    otherMonthly: "Otros gastos mensuales",
    expectedJobs: "Trabajos previstos por mes",
    monthlyOverhead: "Gastos Fijos Mensuales",
    overheadPerJob: "Gastos Fijos por Trabajo",
    paymentFees: "Comisiones de Pago",
    paymentFeesDescription: "Procesamiento de pagos con tarjeta o en línea.",
    processingFee: "Comisión de procesamiento",
    desiredProfit: "Utilidad Deseada",
    desiredProfitDescription: "Tu margen objetivo sobre el precio final.",
    desiredMargin: "Margen de utilidad deseado",
    resetCalculator: "Restablecer Calculadora",
    pricingBreakdown: "Desglose de tu Precio",
    breakEvenPrice: "Precio de Equilibrio",
    breakEvenWarning: "Si cobras menos que esto, estás perdiendo dinero.",
    recommendedPrice: "Precio Recomendado",
    resultOfferPrompt: "¿Necesitas ayuda para definir tus tarifas exactas?",
    resultOfferLink: "Obtén una configuración personalizada de precios →",
    estimatedProfit: "Utilidad Estimada",
    profitMargin: "Margen de Utilidad",
    revenueLaborHour: "Ingreso por Hora de Trabajo",
    totalJobCost: "Costo Total del Trabajo",
    viewCostBreakdown: "Ver desglose de costos",
    variableCosts: "Costos variables",
    feeAtRecommended: "Comisión de pago sobre el precio recomendado",
    suggestedOptions: "Opciones sugeridas",
    pricingPackages: "Paquetes de Precios",
    packagesDescription: "Úsalos como punto de partida para una cotización por niveles. Ajusta el alcance del trabajo a cada paquete.",
    packageBasic: "Básico",
    packageBasicDescription: "Aproximadamente el 90% del precio recomendado para un alcance más acotado.",
    recommended: "Recomendado",
    packageStandard: "Estándar",
    packageStandardDescription: "El precio recomendado completo para el alcance planificado.",
    packagePremium: "Premium",
    packagePremiumDescription: "Aproximadamente el 120% del precio recomendado para ofrecer más valor.",
    packageDisclaimer: "Los precios sugeridos se redondean para facilitar su presentación. Confirma que los servicios incluidos justifiquen cada precio.",
    offerHeadline: "¿Quieres precios adaptados a la realidad de tu negocio?",
    offerDescription: "Obtén una configuración personalizada basada en tus costos de mano de obra, gastos fijos, servicios y objetivos de utilidad.",
    offerIncludes: "Qué incluye tu configuración",
    offerFeatureStructure: "Estructura de precios personalizada",
    offerFeatureMinimums: "Tarifas mínimas recomendadas",
    offerFeatureMargins: "Objetivos de margen de utilidad",
    offerFeatureServices: "Recomendaciones de precios por servicio",
    offerFeatureOverhead: "Asignación de gastos fijos",
    offerFeatureReview: "Revisión de precios de tus servicios actuales",
    offerPrice: "Precio de lanzamiento: {price}",
    offerCta: "Obtener mi Configuración Personalizada de Precios",
    checkoutSoon: "El pago estará disponible pronto",
    goalEyebrow: "Planifica más allá del próximo trabajo",
    goalTitle: "Calculadora de Meta Mensual",
    goalDescription: "Descubre cuántos trabajos necesitas reservar para alcanzar tu meta mensual de utilidad.",
    desiredMonthlyProfit: "Utilidad mensual deseada",
    averageProfitJob: "Utilidad promedio por trabajo",
    useCurrentEstimate: "Usar estimación actual",
    jobsMonth: "trabajos / mes",
    jobsWeek: "trabajos / semana",
    comingNext: "Próximamente",
    advancedTitle: "¿Quieres una versión más avanzada?",
    advancedDescription: "Únete a la lista de acceso anticipado para futuras herramientas que te ayudarán a fijar precios, cotizar y gestionar tu negocio de limpieza.",
    featureSavedJobs: "Trabajos guardados",
    featureQuoteGenerator: "Generador de cotizaciones para clientes",
    featureRecurringPricing: "Precios para limpiezas recurrentes",
    featurePrintableEstimates: "Presupuestos imprimibles",
    featureCustomRules: "Reglas de precios personalizadas",
    featureDashboard: "Panel de control del negocio",
    emailAddress: "Correo electrónico",
    optional: "(opcional)",
    emailPlaceholder: "tu@negocio.com",
    getEarlyAccess: "Obtener Acceso Anticipado",
    leadPrivacy: "Este es un prototipo: tu correo se guarda en este dispositivo y no se envía a ningún servidor.",
    disclaimer: "Esta calculadora ofrece estimaciones de precios con fines educativos y de planificación comercial. Los costos, impuestos, salarios y gastos reales del negocio pueden variar.",
    saved: "Guardado",
    resultUnavailable: "Ingresa datos válidos de mano de obra, gastos fijos y objetivos de precio para ver tu cotización.",
    laborError: "Ingresa un pago por hora, al menos un trabajador y una cantidad de horas de limpieza mayor que cero.",
    overheadError: "Los trabajos previstos por mes deben ser al menos 1.",
    targetError: "El margen deseado y la comisión de pago deben sumar menos de 100%.",
    goalError: "Ingresa una meta mensual y una utilidad promedio mayores que $0.",
    localLeadSuccess: "Guardado solo en este dispositivo. No se envió nada a un servidor.",
    leadRequired: "Ingresa un correo para guardar tu interés en este dispositivo.",
    leadInvalid: "Ingresa un correo electrónico válido.",
    leadStorageError: "El navegador no pudo guardar el correo localmente. No se envió nada.",
    serviceMultiplierHelp: "{service} usa un multiplicador de complejidad de {multiplier}×.",
    recommendedContext: "{service} · complejidad {multiplier}×",
    serviceStandard: "Limpieza Estándar",
    serviceDeep: "Limpieza Profunda",
    serviceMove: "Limpieza de Entrada / Salida",
    serviceAirbnb: "Airbnb / Alquiler de Corta Estadía",
    serviceCommercial: "Limpieza Comercial",
    serviceCustom: "Personalizado",
  },
});

let currentLanguage = APP_CONFIG.defaultLanguage;

const CALCULATOR_FIELD_IDS = Object.keys(APP_CONFIG.defaults);
const GOAL_FIELD_IDS = Object.keys(APP_CONFIG.goalDefaults);
const VARIABLE_COST_FIELDS = ["supplies", "travel", "parking", "jobEquipment", "otherVariable"];
const OVERHEAD_FIELDS = [
  "insurance",
  "software",
  "phone",
  "marketing",
  "vehicle",
  "monthlyEquipment",
  "office",
  "otherMonthly",
];

const moneyFormatter = new Intl.NumberFormat(APP_CONFIG.locale, {
  style: "currency",
  currency: APP_CONFIG.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeMoneyFormatter = new Intl.NumberFormat(APP_CONFIG.locale, {
  style: "currency",
  currency: APP_CONFIG.currency,
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat(APP_CONFIG.locale, {
  maximumFractionDigits: 0,
});

let savedStatusTimer;
let goalAverageMode = "auto";
let latestEstimatedProfit = null;

function t(key, replacements = {}) {
  const fallback = TRANSLATIONS.en[key] ?? key;
  const template = TRANSLATIONS[currentLanguage]?.[key] ?? fallback;
  return Object.entries(replacements).reduce(
    (value, [token, replacement]) => value.replaceAll(`{${token}}`, String(replacement)),
    template,
  );
}

function readStoredLanguage() {
  try {
    const storedLanguage = localStorage.getItem(APP_CONFIG.storage.language);
    return APP_CONFIG.supportedLanguages.includes(storedLanguage) ? storedLanguage : APP_CONFIG.defaultLanguage;
  } catch (error) {
    console.warn("Language preference could not be read.", error);
    return APP_CONFIG.defaultLanguage;
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem(APP_CONFIG.storage.language, language);
  } catch (error) {
    console.warn("Language preference could not be saved.", error);
  }
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = t("metaTitle");
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = t("metaDescription");
  const openGraphTitle = document.querySelector('meta[property="og:title"]');
  const openGraphDescription = document.querySelector('meta[property="og:description"]');
  if (openGraphTitle) openGraphTitle.content = t("ogTitle");
  if (openGraphDescription) openGraphDescription.content = t("ogDescription");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setLanguage(language, { persist = true } = {}) {
  if (!APP_CONFIG.supportedLanguages.includes(language)) return;
  const selectedService = byId("serviceType")?.value || APP_CONFIG.defaults.serviceType;
  currentLanguage = language;
  applyTranslations();
  renderCommercialOffer();
  populateServiceTypes(selectedService);
  setText("savedStatus", t("saved"));
  recalculate();
  recalculateMonthlyGoal();

  const leadMessage = byId("leadMessage");
  if (leadMessage?.dataset.messageKey) {
    leadMessage.textContent = t(leadMessage.dataset.messageKey);
  }

  if (persist) saveLanguage(language);
}

function byId(id) {
  return document.getElementById(id);
}

function finiteNonNegative(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.min(number, APP_CONFIG.limits.maxSafeInput);
}

function sumFields(model, fieldNames) {
  return fieldNames.reduce((total, fieldName) => total + finiteNonNegative(model[fieldName]), 0);
}

function getServiceType(serviceId) {
  return APP_CONFIG.serviceTypes.find((service) => service.id === serviceId) ?? APP_CONFIG.serviceTypes[0];
}

/**
 * Pure pricing engine.
 *
 * Formulas:
 *   laborCost = hourlyWage × workers × hours
 *   directCosts = laborCost + variableCosts
 *   overheadPerJob = monthlyOverhead ÷ expectedJobsPerMonth
 *   totalJobCost = directCosts + overheadPerJob
 *   breakEvenPrice = totalJobCost ÷ (1 - paymentFeeRate)
 *
 * The selected service multiplier adjusts the cost basis to account for
 * complexity and risk before solving for the final customer price:
 *   adjustedCostBasis = totalJobCost × serviceMultiplier
 *
 * The desired margin is a true margin on the FINAL price, not a markup on cost:
 *   recommendedPrice = adjustedCostBasis ÷
 *                      (1 - desiredMarginRate - paymentFeeRate)
 *
 * Example: a 30% desired margin is not calculated as cost × 1.30. The formula
 * reserves 30% of the final price for margin and the fee percentage for the
 * payment processor. For service multipliers above 1.00, the actual reported
 * margin can exceed the target because the multiplier adds a complexity buffer.
 */
function calculatePricing(model, serviceType = getServiceType(model.serviceType)) {
  const hourlyWage = finiteNonNegative(model.hourlyWage);
  const workers = finiteNonNegative(model.workers);
  const hours = finiteNonNegative(model.hours);
  const jobsPerMonth = finiteNonNegative(model.jobsPerMonth);
  const paymentFeeRate = finiteNonNegative(model.paymentFee) / 100;
  const desiredMarginRate = finiteNonNegative(model.desiredMargin) / 100;

  const laborCost = hourlyWage * workers * hours;
  const variableCosts = sumFields(model, VARIABLE_COST_FIELDS);
  const directCosts = laborCost + variableCosts;
  const monthlyOverhead = sumFields(model, OVERHEAD_FIELDS);
  const overheadPerJob = jobsPerMonth > 0 ? monthlyOverhead / jobsPerMonth : null;
  const totalJobCost = overheadPerJob === null ? null : directCosts + overheadPerJob;
  const pricingDenominator = 1 - desiredMarginRate - paymentFeeRate;
  const breakEvenDenominator = 1 - paymentFeeRate;

  const laborIsValid = hourlyWage > 0 && workers > 0 && hours > 0;
  const overheadIsValid = jobsPerMonth > 0;
  const targetsAreValid = paymentFeeRate >= 0 && desiredMarginRate >= 0 && pricingDenominator > 0;
  const costIsValid = totalJobCost !== null && totalJobCost > 0;
  const isValid = laborIsValid && overheadIsValid && targetsAreValid && costIsValid;

  if (!isValid) {
    return {
      isValid,
      validation: { laborIsValid, overheadIsValid, targetsAreValid, costIsValid },
      laborCost,
      variableCosts,
      directCosts,
      monthlyOverhead,
      overheadPerJob,
      totalJobCost,
      serviceType,
    };
  }

  const breakEvenPrice = totalJobCost / breakEvenDenominator;
  const adjustedCostBasis = totalJobCost * serviceType.multiplier;
  const recommendedPrice = adjustedCostBasis / pricingDenominator;
  const processingFeeAmount = recommendedPrice * paymentFeeRate;
  const estimatedProfit = recommendedPrice - totalJobCost - processingFeeAmount;
  const actualProfitMargin = recommendedPrice > 0 ? (estimatedProfit / recommendedPrice) * 100 : 0;
  const totalLaborHours = workers * hours;
  const revenuePerLaborHour = totalLaborHours > 0 ? recommendedPrice / totalLaborHours : null;

  const numericResults = [
    breakEvenPrice,
    adjustedCostBasis,
    recommendedPrice,
    processingFeeAmount,
    estimatedProfit,
    actualProfitMargin,
    revenuePerLaborHour,
  ];

  if (!numericResults.every(Number.isFinite)) {
    return {
      isValid: false,
      validation: { laborIsValid, overheadIsValid, targetsAreValid: false, costIsValid },
      laborCost,
      variableCosts,
      directCosts,
      monthlyOverhead,
      overheadPerJob,
      totalJobCost,
      serviceType,
    };
  }

  return {
    isValid: true,
    validation: { laborIsValid, overheadIsValid, targetsAreValid, costIsValid },
    laborCost,
    variableCosts,
    directCosts,
    monthlyOverhead,
    overheadPerJob,
    totalJobCost,
    serviceType,
    paymentFeeRate,
    desiredMarginRate,
    breakEvenPrice,
    adjustedCostBasis,
    recommendedPrice,
    processingFeeAmount,
    estimatedProfit,
    actualProfitMargin,
    revenuePerLaborHour,
  };
}

function formatMoney(value) {
  return Number.isFinite(value) ? moneyFormatter.format(value) : "—";
}

function formatPercent(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : "—";
}

/**
 * Package prices are always rounded up to a whole dollar. For prices at or
 * above $100, a nearby price ending in 9 is used only when it is no more than
 * $3 higher. This turns $187.31 into $189 without producing large jumps.
 */
function commercialRound(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  let rounded = Math.ceil(value);

  if (value >= 100) {
    const nearbyNine = Math.ceil((value - 9) / 10) * 10 + 9;
    if (nearbyNine >= value && nearbyNine - value <= 3) rounded = nearbyNine;
  }

  return rounded;
}

function renderCommercialOffer() {
  const offer = APP_CONFIG.commercialOffer;
  const localizedProductName = offer.productName[currentLanguage] ?? offer.productName.en;
  const formattedPrice = wholeMoneyFormatter.format(finiteNonNegative(offer.priceUsd));
  const purchaseUrl = String(offer.purchaseUrl ?? "").trim();
  const hasCheckout = /^https?:\/\//i.test(purchaseUrl);
  const cta = byId("purchaseCta");
  const status = byId("checkoutStatus");

  setText("offerProductName", localizedProductName);
  setText("offerPrice", t("offerPrice", { price: formattedPrice }));

  if (hasCheckout) {
    cta.href = purchaseUrl;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer";
    cta.removeAttribute("aria-disabled");
    status.hidden = true;
    return;
  }

  cta.removeAttribute("href");
  cta.removeAttribute("target");
  cta.removeAttribute("rel");
  cta.setAttribute("aria-disabled", "true");
  status.hidden = false;
}

function setText(id, value) {
  const element = byId(id);
  if (element) element.textContent = value;
}

function setInvalid(id, isInvalid) {
  const element = byId(id);
  if (!element) return;
  if (isInvalid) element.setAttribute("aria-invalid", "true");
  else element.removeAttribute("aria-invalid");
}

function showMessage(id, message, shouldShow) {
  const element = byId(id);
  if (!element) return;
  element.textContent = message;
  element.hidden = !shouldShow;
}

function populateServiceTypes(selectedValue = byId("serviceType").value || APP_CONFIG.defaults.serviceType) {
  const select = byId("serviceType");
  select.replaceChildren();
  APP_CONFIG.serviceTypes.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.id;
    option.textContent = t(service.labelKey);
    select.append(option);
  });
  select.value = APP_CONFIG.serviceTypes.some((service) => service.id === selectedValue)
    ? selectedValue
    : APP_CONFIG.defaults.serviceType;
}

function readCalculatorModel() {
  const model = {};
  CALCULATOR_FIELD_IDS.forEach((id) => {
    const element = byId(id);
    model[id] = element.type === "number" ? finiteNonNegative(element.value) : element.value;
  });
  return model;
}

function updateValidation(result, model) {
  const laborInvalid = !result.validation.laborIsValid;
  const overheadInvalid = !result.validation.overheadIsValid;
  const targetsInvalid = !result.validation.targetsAreValid;

  ["hourlyWage", "workers", "hours"].forEach((id) => setInvalid(id, laborInvalid && finiteNonNegative(model[id]) <= 0));
  setInvalid("jobsPerMonth", overheadInvalid);
  setInvalid("paymentFee", targetsInvalid);
  setInvalid("desiredMargin", targetsInvalid);

  showMessage("laborValidation", t("laborError"), laborInvalid);
  showMessage("overheadValidation", t("overheadError"), overheadInvalid);
  showMessage("targetValidation", t("targetError"), targetsInvalid);
}

function renderPricing(result, model) {
  setText("laborCost", formatMoney(result.laborCost));
  setText("variableCosts", formatMoney(result.variableCosts));
  setText("monthlyOverhead", formatMoney(result.monthlyOverhead));
  setText("overheadPerJob", formatMoney(result.overheadPerJob));

  const service = result.serviceType;
  const serviceLabel = t(service.labelKey);
  const multiplier = service.multiplier.toFixed(2);
  setText("serviceTypeHelp", t("serviceMultiplierHelp", { service: serviceLabel, multiplier }));
  setText("recommendedContext", t("recommendedContext", { service: serviceLabel, multiplier }));

  updateValidation(result, model);

  const resultContent = byId("resultContent");
  const unavailable = byId("resultUnavailable");
  resultContent.hidden = !result.isValid;
  unavailable.hidden = result.isValid;
  unavailable.textContent = t("resultUnavailable");

  if (!result.isValid) {
    ["basicPrice", "standardPrice", "premiumPrice"].forEach((id) => setText(id, "—"));
    byId("packageGrid").classList.add("is-unavailable");
    return;
  }

  setText("breakEvenPrice", formatMoney(result.breakEvenPrice));
  setText("recommendedPrice", formatMoney(result.recommendedPrice));
  setText("estimatedProfit", formatMoney(result.estimatedProfit));
  setText("profitMargin", formatPercent(result.actualProfitMargin));
  setText("revenuePerHour", formatMoney(result.revenuePerLaborHour));
  setText("totalJobCost", formatMoney(result.totalJobCost));
  setText("costLabor", formatMoney(result.laborCost));
  setText("costVariable", formatMoney(result.variableCosts));
  setText("costOverhead", formatMoney(result.overheadPerJob));
  setText("processingFeeAmount", formatMoney(result.processingFeeAmount));

  const packageValues = {
    basicPrice: commercialRound(result.recommendedPrice * 0.9),
    standardPrice: commercialRound(result.recommendedPrice),
    premiumPrice: commercialRound(result.recommendedPrice * 1.2),
  };

  Object.entries(packageValues).forEach(([id, value]) => {
    setText(id, value === null ? "—" : wholeMoneyFormatter.format(value));
  });
  byId("packageGrid").classList.remove("is-unavailable");
}

function syncAverageProfitFromPricing(result) {
  const syncButton = byId("useCurrentEstimate");
  const hasCurrentEstimate = result.isValid && Number.isFinite(result.estimatedProfit) && result.estimatedProfit > 0;

  latestEstimatedProfit = hasCurrentEstimate ? result.estimatedProfit : null;
  syncButton.disabled = !hasCurrentEstimate;

  if (goalAverageMode !== "auto" || latestEstimatedProfit === null) return;

  byId("averageProfitPerJob").value = latestEstimatedProfit.toFixed(2);
  recalculateMonthlyGoal();
  saveGoalState();
}

function recalculate() {
  const model = readCalculatorModel();
  const result = calculatePricing(model);
  renderPricing(result, model);
  syncAverageProfitFromPricing(result);
  return result;
}

function sanitizeNumberInput(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "number" || input.value === "") return;

  let number = Number(input.value);
  if (!Number.isFinite(number)) {
    input.value = "";
    return;
  }
  if (number < 0) number = 0;
  if (input.max !== "" && number > Number(input.max)) number = Number(input.max);
  if (number > APP_CONFIG.limits.maxSafeInput) number = APP_CONFIG.limits.maxSafeInput;
  input.value = String(number);
}

function readStoredObject(key) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.warn("Local storage could not be read.", error);
    return null;
  }
}

function writeStoredObject(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Local storage could not be updated.", error);
    return false;
  }
}

function applyValues(defaults, storedValues, fieldIds) {
  const state = { ...defaults, ...(storedValues ?? {}) };
  fieldIds.forEach((id) => {
    const element = byId(id);
    if (!element || state[id] === undefined || state[id] === null) return;
    element.value = String(state[id]);
  });
}

function saveCalculatorState() {
  const state = {};
  CALCULATOR_FIELD_IDS.forEach((id) => {
    state[id] = byId(id).value;
  });
  if (writeStoredObject(APP_CONFIG.storage.calculator, state)) flashSavedStatus();
}

function flashSavedStatus() {
  const status = byId("savedStatus");
  status.textContent = t("saved");
  status.classList.add("is-visible");
  window.clearTimeout(savedStatusTimer);
  savedStatusTimer = window.setTimeout(() => status.classList.remove("is-visible"), 900);
}

function bindCalculator() {
  const form = byId("calculatorForm");
  form.addEventListener("input", (event) => {
    sanitizeNumberInput(event);
    recalculate();
    saveCalculatorState();
  });
  form.addEventListener("change", () => {
    recalculate();
    saveCalculatorState();
  });

  byId("resetCalculator").addEventListener("click", () => {
    try {
      localStorage.removeItem(APP_CONFIG.storage.calculator);
    } catch (error) {
      console.warn("Saved calculator values could not be removed.", error);
    }
    applyValues(APP_CONFIG.defaults, null, CALCULATOR_FIELD_IDS);
    recalculate();
    flashSavedStatus();
    byId("serviceType").focus();
  });
}

function readGoalModel() {
  return {
    monthlyProfitGoal: finiteNonNegative(byId("monthlyProfitGoal").value),
    averageProfitPerJob: finiteNonNegative(byId("averageProfitPerJob").value),
  };
}

function recalculateMonthlyGoal() {
  const model = readGoalModel();
  const isValid = model.monthlyProfitGoal > 0 && model.averageProfitPerJob > 0;

  setInvalid("monthlyProfitGoal", model.monthlyProfitGoal <= 0);
  setInvalid("averageProfitPerJob", model.averageProfitPerJob <= 0);
  showMessage("goalValidation", t("goalError"), !isValid);

  if (!isValid) {
    setText("jobsRequiredMonth", "—");
    setText("jobsRequiredWeek", "—");
    return;
  }

  const jobsPerMonth = Math.ceil(model.monthlyProfitGoal / model.averageProfitPerJob);
  const jobsPerWeek = Math.ceil(jobsPerMonth / APP_CONFIG.weeksPerMonth);
  setText("jobsRequiredMonth", integerFormatter.format(jobsPerMonth));
  setText("jobsRequiredWeek", `~${integerFormatter.format(jobsPerWeek)}`);
}

function saveGoalState() {
  const state = {};
  GOAL_FIELD_IDS.forEach((id) => {
    state[id] = byId(id).value;
  });
  state.averageProfitMode = goalAverageMode;
  writeStoredObject(APP_CONFIG.storage.monthlyGoal, state);
}

function bindMonthlyGoal() {
  const form = byId("goalForm");
  form.addEventListener("input", (event) => {
    sanitizeNumberInput(event);
    if (event.target.id === "averageProfitPerJob") goalAverageMode = "manual";
    recalculateMonthlyGoal();
    saveGoalState();
  });

  byId("useCurrentEstimate").addEventListener("click", () => {
    if (latestEstimatedProfit === null) return;
    goalAverageMode = "auto";
    byId("averageProfitPerJob").value = latestEstimatedProfit.toFixed(2);
    recalculateMonthlyGoal();
    saveGoalState();
  });
}

/**
 * PRE-LAUNCH REQUIREMENT:
 * Connect this adapter to a real form service or backend before presenting the
 * email field as a remotely collected early-access list. The current MVP only
 * saves the address in localStorage on the visitor's device and never sends it.
 * Replace only save() with a fetch() integration; the form handler can remain.
 */
const leadStorageAdapter = {
  save(email) {
    const stored = readStoredObject(APP_CONFIG.storage.earlyAccess);
    const entries = Array.isArray(stored) ? stored : [];
    const normalizedEmail = email.trim().toLowerCase();

    if (!entries.some((entry) => entry.email === normalizedEmail)) {
      entries.push({ email: normalizedEmail, savedAt: new Date().toISOString() });
    }

    return writeStoredObject(APP_CONFIG.storage.earlyAccess, entries);
  },
};

function setLeadMessage(messageKey, isError = false) {
  const messageElement = byId("leadMessage");
  messageElement.dataset.messageKey = messageKey;
  messageElement.textContent = t(messageKey);
  messageElement.hidden = false;
  messageElement.classList.toggle("is-error", isError);
}

function bindLeadForm() {
  const form = byId("leadForm");
  const emailInput = byId("emailAddress");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      setInvalid("emailAddress", true);
      setLeadMessage("leadRequired", true);
      emailInput.focus();
      return;
    }

    if (!emailInput.validity.valid) {
      setInvalid("emailAddress", true);
      setLeadMessage("leadInvalid", true);
      emailInput.focus();
      return;
    }

    setInvalid("emailAddress", false);
    if (leadStorageAdapter.save(email)) {
      setLeadMessage("localLeadSuccess");
      form.reset();
    } else {
      setLeadMessage("leadStorageError", true);
    }
  });
}

function bindLanguageSwitcher() {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
}

function initializeApp() {
  const storedGoalState = readStoredObject(APP_CONFIG.storage.monthlyGoal);
  currentLanguage = readStoredLanguage();
  goalAverageMode = storedGoalState?.averageProfitMode === "manual" ? "manual" : "auto";
  applyTranslations();
  renderCommercialOffer();
  populateServiceTypes();
  applyValues(APP_CONFIG.defaults, readStoredObject(APP_CONFIG.storage.calculator), CALCULATOR_FIELD_IDS);
  applyValues(APP_CONFIG.goalDefaults, storedGoalState, GOAL_FIELD_IDS);
  bindCalculator();
  bindMonthlyGoal();
  bindLeadForm();
  bindLanguageSwitcher();
  recalculate();
  recalculateMonthlyGoal();
}

// Expose the reusable, pure engine for future calculator variants and testing.
window.PricingEngine = Object.freeze({
  config: APP_CONFIG,
  translations: TRANSLATIONS,
  calculatePricing,
  commercialRound,
});

initializeApp();
