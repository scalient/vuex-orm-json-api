export const PROJECT_NAME_HUMANIZED = "Vuex ORM JSON:API";

export const API_ROOT = "/api";

const dashReplacementRegExp = new RegExp("-", "g");

export const kebabCaseToSnakeCase = ((type) => type.replace(dashReplacementRegExp, "_"));

export const defaultResourceToEntityCase = kebabCaseToSnakeCase;

export const defaultEntityToResourceRouteCase = (type) => type;
