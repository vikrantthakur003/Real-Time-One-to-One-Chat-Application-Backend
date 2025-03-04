import { USER } from '../../models';


export const saveUser = async (data: Object) => new Promise((resolve, reject) => {
  const userDetails = new USER(data);

  userDetails.save()
    .then(resolve)
    .catch(reject);
});

export const getUser = async (search: Object, projection: any = {}, options: any = {}) => new Promise((resolve, reject) => {
  USER.findOne(search, projection, options)
    .lean()
    .then(resolve)
    .catch(reject);
});

export const getUsers = async (search: Object, projection: any = {}, options: any = {}) => new Promise((resolve, reject) => {
  USER.find(search, projection, options)
    .select('-password')
    .populate('unreadCount')
    .lean()
    .then(resolve)
    .catch(reject);
})