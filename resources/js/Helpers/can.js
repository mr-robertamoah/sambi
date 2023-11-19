import permissionEnum from "@/Enums/permissionEnum";

export default function can(user, action, entity, entityUser = null) {
    if (user.permissions?.find((value) => value.name == permissionEnum.CAN_MANAGE_ALL)) return true
    if (action == "update" && user.id == entityUser?.id) return true
    
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
            permissionEnum.CAN_MANAGE_PRODUCT,
            permissionEnum.CAN_MAKE_PRODUCT_ENTRY,
        ],
        update: [
            permissionEnum.CAN_MANAGE_PRODUCT,
        ]
    },
    costs: {
        create: [
            permissionEnum.CAN_MANAGE_COST,
            permissionEnum.CAN_MAKE_COST_ENTRY,
        ],
        update: [
            permissionEnum.CAN_MANAGE_COST,
        ]
    },
    sales: {
        create: [
            permissionEnum.CAN_MANAGE_SALE,
            permissionEnum.CAN_MAKE_SALE_ENTRY,
        ],
        update: [
            permissionEnum.CAN_MANAGE_SALE,
        ]
    },
    productions: {
        create: [
            permissionEnum.CAN_MANAGE_PRODUCTION,
            permissionEnum.CAN_MAKE_PRODUCTION_ENTRY,
        ],
        update: [
            permissionEnum.CAN_MANAGE_PRODUCTION,
        ]
    },
    categories: {
        create: [
            permissionEnum.CAN_MANAGE_CATEGORY,
            permissionEnum.CAN_MAKE_CATEGORY_ENTRY,
        ],
        update: [
            permissionEnum.CAN_MANAGE_CATEGORY,
        ]
    },
    costItems: {
        create: [
            permissionEnum.CAN_MANAGE_COSTITEM,
            permissionEnum.CAN_MAKE_COSTITEM_ENTRY,
        ],
        update: [
            permissionEnum.CAN_MANAGE_COSTITEM,
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