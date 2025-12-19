import Link from "next/link";

const UserCollectionDescription = () => {
  return (
    <>
      <p>Manage who can access and edit the site, including roles and permissions.</p>
      <p>Learn about roles and permissions <Link style={{textDecoration: "underline"}} href="/admin/sites-roles-and-permissions">here</Link>.</p>
    </>
  )
}

export default UserCollectionDescription;
