import { MESSAGE } from '../../models';


export const saveMessage = async (data:Object) => new Promise((resolve, reject)=>{
  const message = new MESSAGE(data);

  message.save()
    .then(resolve)
    .catch(reject);
});

export const getMessages = async (search: Object, projection: any = {}, options: any = {}) => new Promise((resolve, reject) => {
  MESSAGE.find(search, projection, options)
    .lean()
    // .sort({ createdAt: -1 })
    .then(resolve)
    .catch(reject);
});

export const getMessageCount = async (search: Object) => new Promise((resolve, reject) => {
  MESSAGE.countDocuments(search)
    .then(resolve)
    .catch(reject);
});

export const updateMessages = async (search: Object, update: Object) => new Promise((resolve, reject) => {
  MESSAGE.updateMany(search, update)
    .then(resolve)
    .catch(reject);
})
