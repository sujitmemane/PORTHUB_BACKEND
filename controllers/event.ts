import BookingModel from "../models/booking";
import EventModel from "../models/event";
import UserModel from "../models/user";
import { errorResponse, successResponse } from "../utils/responses";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const handleCreateEvent = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { title, description, duration, availableDays, dayStart, dayEnd } =
    req.body;

  if (
    !title ||
    !description ||
    !duration ||
    !availableDays ||
    !dayStart ||
    !dayEnd
  ) {
    return errorResponse(res, 400, {}, "All fields are required");
  }

  try {
    const event = await EventModel.create({
      user: _id,
      title,
      description,
      duration,
      availableDays,
      dayStart,
      dayEnd,
    });

    return successResponse(res, 201, event, "Event created successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to create event"
    );
  }
};

export const handleDeleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.body;
  const { _id } = req.user;

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return errorResponse(res, 400, {}, "Invalid or missing eventId");
  }

  try {
    const event = await EventModel.findOneAndDelete({
      _id: eventId,
      user: _id,
    });
    if (!event) {
      return errorResponse(res, 404, {}, "Event not found or not authorized");
    }

    await BookingModel.deleteMany({ event: event._id });

    return successResponse(res, 200, {}, "Event deleted successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to delete event"
    );
  }
};

export const getUserEvents = async (req: Request, res: Response) => {
  const { _id } = req.user;

  try {
    const events = await EventModel.find({ user: _id }).sort({ createdAt: -1 });
    return successResponse(
      res,
      200,
      events,
      "User events fetched successfully"
    );
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to fetch events"
    );
  }
};

export const handleUpdateEvent = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const {
    eventId,
    title,
    description,
    duration,
    availableDays,
    dayStart,
    dayEnd,
  } = req.body;

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return errorResponse(res, 400, {}, "Invalid or missing eventId");
  }

  try {
    const event = await EventModel.findOneAndUpdate(
      { _id: eventId, user: _id },
      { title, description, duration, availableDays, dayStart, dayEnd },
      { new: true, runValidators: true }
    );

    if (!event) {
      return errorResponse(res, 404, {}, "Event not found or not authorized");
    }

    return successResponse(res, 200, event, "Event updated successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to update event"
    );
  }
};

export const handleCreateEventBookingRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      eventId,
      username,
      name,
      email,
      phoneNumber,
      description,
      bookingDate,
      slot,
    } = req.body;

    if (
      !eventId ||
      !username ||
      !name ||
      !email ||
      !phoneNumber ||
      !bookingDate ||
      !slot?.startTime ||
      !slot?.endTime
    ) {
      return errorResponse(res, 400, {}, "Missing required fields");
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return errorResponse(res, 400, {}, "Invalid eventId");
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return errorResponse(res, 404, {}, "Event not found");
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return errorResponse(res, 404, {}, "User not found");
    }

    const slotConflict = await BookingModel.findOne({
      event: eventId,
      bookingDate,
      "slot.startTime": { $lt: slot.endTime },
      "slot.endTime": { $gt: slot.startTime },
    });

    if (slotConflict) {
      return errorResponse(res, 409, {}, "This slot is already booked");
    }

    const booking = await BookingModel.create({
      user: user._id,
      event: eventId,
      name,
      email,
      phoneNumber,
      description,
      bookingDate,
      slot: {
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });

    return successResponse(res, 201, booking, "Booking created successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to create booking"
    );
  }
};

export const getEventBookings = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;
    const { _id } = req.user;
    const { status } = req.query;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return errorResponse(res, 400, {}, "Invalid eventId");
    }

    const event = await EventModel.findOne({ _id: eventId, user: _id });
    if (!event) {
      return errorResponse(res, 404, {}, "Event not found or unauthorized");
    }

    const filter: any = { event: eventId };
    if (status && typeof status === "string") {
      filter.status = status.toUpperCase();
    }

    const bookings = await BookingModel.find(filter).sort({ bookingDate: 1 });

    return successResponse(res, 200, bookings, "Bookings fetched successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to fetch bookings"
    );
  }
};
