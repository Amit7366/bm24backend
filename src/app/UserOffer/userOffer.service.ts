import { IUserOffer } from "./userOffer.interface";
import { UserOffer } from "./userOffer.model";

const createUserOffer = async (payload: IUserOffer) => {
  return await UserOffer.create(payload);
};

const getAllUserOffers = async () => {
  return await UserOffer.find().sort({ createdAt: -1 }); 
};


const getSingleUserOffer = async (id: string) => {
  return await UserOffer.findById(id);
};

const updateUserOffer = async (id: string, payload: Partial<IUserOffer>) => {
  return await UserOffer.findByIdAndUpdate(id, payload, { new: true });
};

const deleteUserOffer = async (id: string) => {
  return await UserOffer.findByIdAndDelete(id);
};

export const UserOfferService = {
  createUserOffer,
  getAllUserOffers,
  getSingleUserOffer,
  updateUserOffer,
  deleteUserOffer
};
