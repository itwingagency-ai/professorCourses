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
  links: ILink;
  suggestion: string;
  // same like comments
  questions: IComment[];
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
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  rejectionReason?: string;
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
        enum: ['draft', 'pending', 'published', 'rejected'],
        default: 'pending',
    },
    rejectionReason: {
        type: String,
    },
}, {timestamps:true});

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel; 