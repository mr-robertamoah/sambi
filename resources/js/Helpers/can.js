export default function can(user, item, permission) {
    if (user.permissions?.find((value) => value.name == "can manage all")) return true
    user.permissions?.forEach(perm => {
        if (permissions[item]) {
            if (permissions[item][permission]?.includes(perm)) return true
        }
    });

    return false
}

const permissionEnum = 
{
    CAN_MANAGE_USER: "can manage user",
    CAN_MANAGE_CATEGORY: "can manage category",
    CAN_MANAGE_COST: "can manage cost",
    CAN_MANAGE_SALE: "can manage sale",
    CAN_MANAGE_PRODUCTION: "can manage production",
    CAN_MANAGE_COSTITEM: "can manage cost item",
    CAN_MANAGE_PRODUCT: "can manage product",
    CAN_CREATE_PRODUCT: "can create product",
    CAN_MANAGE_ALL: "can manage all",
    CAN_ASSIGN_PERMISSION: "can assign permission",
}

const permissions = 
{
    products: {
        create: [
            permissionEnum.CAN_CREATE_PRODUCT,
        ]
    },
    users: {
        view: [
            permissionEnum.CAN_MANAGE_USER,
        ],
        delete: [
            permissionEnum.CAN_MANAGE_USER,
        ],
    },
}