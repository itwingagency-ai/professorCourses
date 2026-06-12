import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// interface for comment
interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}
// interface for review
interface IReview extends Document {
  user: IUser;
  // rating: string
  rating: number;
  comment: string;
  // only admin
  commentReplies: IComment[];
}

// interface Ilink
interface ILink extends Document {
  title: string;
  url: string;
}
// interface for Coursedata
interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  // same like comments
  questions: IComment[];
  isFreePreview?: boolean;
}

interface IApprovalHistory {
  status: string;
  reason?: string;
  changedBy: string;
  changedAt: Date;
}

// interface Icourse
interface ICourse extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  // original price
  estimatedPrice: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
  // Teacher ownership
  createdBy?: mongoose.Types.ObjectId;
  teacherId?: string;
  status?: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  rejectionReason?: string;
  slug?: string;
  language?: string;
  requirements?: { title: string }[];
  whatYouWillLearn?: { title: string }[];
  targetAudience?: { title: string }[];
  courseTags?: string[];
  duration?: string;
  previewVideoUrl?: string;
  isFeatured?: boolean;
  isArchived?: boolean;
  approvalHistory?: IApprovalHistory[];
  isCertificateEnabled?: boolean;
}

// review Schema
const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

// links schema
const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

// Comment Schema
const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});

// course data schema
const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
  isFreePreview: {
    type: Boolean,
    default: false,
  },
});

// course Schema
const courseSchema = new Schema<ICourse>({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    estimatedPrice:{
        type:Number,
    },
    thumbnail:{
        public_id:{
            type:String, 
        },
        url:{ 
            type: String,
        },
    },
    tags:{
        required: true,
        type: String,
    },
    level:{
        required: true,
        type: String,
    },
    demoUrl:{
        required: true,
        type: String,
    },
    benefits:[{title: String}],
    prerequisites:[{title: String}],
    reviews:[reviewSchema],
    courseData: [courseDataSchema],
    ratings:{
        type:Number,
         default:0,
    },
    purchased:{
        type:Number,
         default:0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    teacherId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'published', 'rejected', 'archived'],
        default: 'pending',
    },
    rejectionReason: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    language: {
        type: String,
        default: "English",
    },
    requirements: [{ title: String }],
    whatYouWillLearn: [{ title: String }],
    targetAudience: [{ title: String }],
    courseTags: [String],
    duration: String,
    previewVideoUrl: String,
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    approvalHistory: [
        {
            status: String,
            reason: String,
            changedBy: String,
            changedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    isCertificateEnabled: {
        type: Boolean,
        default: true,
    },
}, {timestamps:true});

// Pre-save hook to generate unique slug from name
courseSchema.pre<ICourse>("save", async function (next) {
  if (!this.slug) {
    const baseSlug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "") || "course";

    let slug = baseSlug;
    let counter = 1;
    const Course = this.constructor as mongoose.Model<ICourse>;
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel; 