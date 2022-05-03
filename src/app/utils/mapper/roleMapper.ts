import { PermissionMap } from "./permissionMapper";

export function RoleMap(data) {
  return {
    id: data.uuid,
    name: data.name,
    permissions: data.permissions
      ? data.permissions.map((item) => PermissionMap(item))
      : [],

    value: data.uuid,
    label: `${data.name}`,
  };
}

export function RoleMapWithoutPermissions(data) {
  return {
    id: data.uuid,
    name: data.name,

    value: data.uuid,
    label: `${data.name}`,
  };
}

export function RoleSelectMapper(data) {
  return {
    value: data.uuid,
    label: `${data.name}`,
  };
}
