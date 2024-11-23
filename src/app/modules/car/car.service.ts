import { ICar } from './car.interface';
import { Car } from './car.model';

const createOne = async (car: ICar) => {
  const result = await Car.create(car);

  return result;
};

const fetchAll = async (searchTerm: string) => {
  const caseInsensitiveSearchTerm = new RegExp(searchTerm, 'i');
  const result = await Car.find({
    $or: [
      { brand: caseInsensitiveSearchTerm },
      { model: caseInsensitiveSearchTerm },
      { category: caseInsensitiveSearchTerm },
    ],
  }).select('-__v');

  return result;
};

const fetchOne = async (id: string) => {
  const result = await Car.findById(id).select('-__v');

  return result;
};

const updateOne = async (id: string, carUpdates: Partial<ICar>) => {
  const result = await Car.findByIdAndUpdate(id, carUpdates, {
    runValidators: true,
    new: true,
  }).select('-__v');

  return result;
};

const deleteOne = async (id: string) => {
  const result = await Car.findByIdAndDelete(id);

  return result;
};

export const CarServices = {
  createOne,
  fetchAll,
  fetchOne,
  updateOne,
  deleteOne,
};
