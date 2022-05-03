import { RoleMap, RoleMapWithoutPermissions } from "./roleMapper";
import { PermissionMap, PermissionMapNameOnly } from "./permissionMapper";
import { MaslowMapper } from "./maslowMapper";
import { CountryMapper } from "./countryMapper";

export function UserMap(data) {
  var allPermission = [];
  var permissions = data.permissions
    ? data.permissions.map((item) => PermissionMap(item))
    : [];
  var roles = data.roles ? data.roles.map((item) => RoleMap(item)) : [];

  allPermission = [...permissions];

  roles.map((item) => {
    item.permissions ? allPermission.push(...item.permissions) : null;
  });

  return {
    id: data.uuid,
    nid: data.id,
    fullname: `${data.firstname} ${data.lastname}`,
    username: data.username,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    bio: data.bio,
    profile_type: data.profile_type,
    profile_id: data.profile_id,
    maslow: data.maslow_status ? MaslowMapper(data.maslow_status) : null,
    country: data.country ? CountryMapper(data.country) : null,
    profile_image: data.profile_image ? data.profile_image.file_url : null,
    roles: data.roles
      ? data.roles.map((item) => RoleMapWithoutPermissions(item))
      : [],
    permissions: allPermission.map((item) => PermissionMapNameOnly(item)),
    created_at: data.createdAt,
    updated_at: data.updatedAt,
    deleted_at: data.deletedAt,
  };
}
