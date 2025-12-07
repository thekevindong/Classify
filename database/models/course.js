const mongoose = require("../../backend/node_modules/mongoose");

// Review subdocument schema
const reviewSchema = new mongoose.Schema(
  {
    professor: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    ratings: {
      workload: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      usefulness: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Main Course schema
const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    courseLevel: {
      type: String,
      required: true,
      enum: ["Undergraduate", "Graduate"],
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    description: {
      type: String,
      required: true,
    },
    prerequisites: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
    professors: [
      {
        type: String,
        trim: true,
      },
    ],
    usefulness: {
      requiredFor: [
        {
          type: String,
          trim: true,
          uppercase: true,
        },
      ],
      genEd: {
        type: String,
        default: null,
        trim: true,
      },
      elective: {
        type: Boolean,
        default: false,
      },
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
courseSchema.index({ department: 1 });
courseSchema.index({ "reviews.professor": 1 });

// Virtual for average ratings
courseSchema.virtual("averageRatings").get(function () {
  if (this.reviews.length === 0) return null;

  const totals = this.reviews.reduce(
    (acc, review) => {
      acc.workload += review.ratings.workload;
      acc.difficulty += review.ratings.difficulty;
      acc.usefulness += review.ratings.usefulness;
      acc.overall += review.ratings.overall;
      return acc;
    },
    { workload: 0, difficulty: 0, usefulness: 0, overall: 0 }
  );

  const count = this.reviews.length;
  return {
    workload: (totals.workload / count).toFixed(2),
    difficulty: (totals.difficulty / count).toFixed(2),
    usefulness: (totals.usefulness / count).toFixed(2),
    overall: (totals.overall / count).toFixed(2),
    reviewCount: count,
  };
});

// Method to get reviews by professor
courseSchema.methods.getReviewsByProfessor = function (professorName) {
  return this.reviews.filter(
    (review) => review.professor.toLowerCase() === professorName.toLowerCase()
  );
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
