import config from '../config';
import { USER_ROLE } from '../User/user.constant';
import { User } from '../User/user.model';

const superUser = {
  id: "S-0001",
  userName: 'Sabbir Ahmed',
  email: 'admin@betmaster24.com',
  contactNo: '01679860388',
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  needsPasswordChange: false,
  status: 'active',
  isDeleted: false,
  country: 'USA',
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
