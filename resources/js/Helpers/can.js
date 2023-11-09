import permissionEnum from "@/Enums/permissionEnum";

export default function can(user, action, entity) {
    if (user.permissions?.find((value) => value.name == permissionEnum.CAN_MANAGE_ALL)) return true
    user.permissions?.forEach(perm => {
        if (permissions[entity]) {
            if (permissions[entity][action]?.includes(perm)) return true
        }
    });

    return false
}

export const permissions = 
{
    products: {
        create: [
            permissionEnum.CAN_CREATE_PRODUCT,
        ]
    },
    users: {
        view: [
            permissionEnum.CAN_MANAGE_USER,
            permissionEnum.CAN_ASSIGN_PERMISSION,
            permissionEnum.CAN_VIEW_USER,
        ],
        delete: [
            permissionEnum.CAN_MANAGE_USER,
        ],
    },
    permissions: {
        assign: [
            permissionEnum.CAN_MANAGE_USER,
            permissionEnum.CAN_ASSIGN_PERMISSION,
        ],
        manage: [
            permissionEnum.CAN_MANAGE_ALL,
        ],
    },
}