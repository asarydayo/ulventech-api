import { RoleMap } from "./roleMapper";
import { PermissionMap } from "./permissionMapper";

export function freelancerMap(data) {
  return {
    detail: {
      service_name: data.detail_service_name,
      service_type: data.detail_service_type,
      skill: data.detail_skill,
      experience: data.detail_experience,
      overview: data.detail_overview,
    },
  };
}
