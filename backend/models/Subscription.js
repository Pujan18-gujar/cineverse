const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['monthly', 'yearly'], required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    paymentId: { type: String, default: '' },
  },
  { timestamps: true }
)

subscriptionSchema.methods.isValid = function () {
  return this.isActive && this.endDate > new Date()
}

module.exports = mongoose.model('Subscription', subscriptionSchema)