export default function notCurrentRoute(routeName) {
    return route().current() != routeName
}