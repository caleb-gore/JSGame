export const UserDetails = ({user}) => {
    return (
        <>
            {user.is_active ? <>{user.username}</>: ""}
        </>
    )
}