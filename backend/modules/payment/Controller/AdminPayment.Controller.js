
import PaymentModel from "../Model/PaymentModel.js";






export const GetAllPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentMethod,
      search,
      sort = "desc"
    } = req.query;

    const query = {};

    // Status Filter
    if (status) {
      query.status = status;
    }

    // Payment Method Filter
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    let paymentsQuery = PaymentModel.find(query)
      .populate({
        path: "user",
        select: "firstName lastName email phone profileImage"
      });

    // Search User Name / Email
    if (search) {
      paymentsQuery = PaymentModel.find(query).populate({
        path: "user",
        match: {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        },
        select: "firstName lastName email phone profileImage"
      });
    }

    const payments = await paymentsQuery
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const filteredPayments = payments.filter(
      (payment) => payment.user !== null
    );

    const totalPayments = await PaymentModel.countDocuments(query);

    // Dashboard Summary
    const summary = await PaymentModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },

          totalPaid: {
            $sum: {
              $cond: [{ $eq: ["$status", "Paid"] }, "$amount", 0]
            }
          },

          totalRefunded: {
            $sum: {
              $cond: [{ $eq: ["$status", "Refunded"] }, "$amount", 0]
            }
          },

          paidCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Paid"] }, 1, 0]
            }
          },

          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
            }
          },

          failedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Failed"] }, 1, 0]
            }
          },

          refundedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Refunded"] }, 1, 0]
            }
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: {
        payments: filteredPayments,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalPayments / limit),
          totalPayments
        },
        summary: summary[0] || {
          totalAmount: 0,
          totalPaid: 0,
          totalRefunded: 0,
          paidCount: 0,
          pendingCount: 0,
          failedCount: 0,
          refundedCount: 0
        }
      },
      error: null
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      data: null,
      error: error.message
    });
  }
};