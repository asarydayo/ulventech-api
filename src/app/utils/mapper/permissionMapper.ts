export function PermissionMap(data) {
  return {
    id: data.uuid,
    name: data.name,
  };
}
export function PermissionMapNameOnly(data) {
  return data.name;
}
