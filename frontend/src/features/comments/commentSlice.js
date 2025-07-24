import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (taskId, thunkAPI) => {
    try {
      const res = await axios.get(`/tasks/${taskId}/comments`);
      return { taskId, comments: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ taskId, text }, thunkAPI) => {
    try {
      const res = await axios.post(`/tasks/${taskId}/comments`, { text });
      return { taskId, comment: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ taskId, commentId }, thunkAPI) => {
    try {
      await axios.delete(`/tasks/${taskId}/comments/${commentId}`);
      return { taskId, commentId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to delete comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    byTaskId: {}, // taskId => [comments]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.byTaskId[action.payload.taskId] = action.payload.comments;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.byTaskId[action.payload.taskId]?.push(action.payload.comment);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { taskId, commentId } = action.payload;
        state.byTaskId[taskId] = state.byTaskId[taskId].filter(
          (c) => c._id !== commentId
        );
      });
  },
});

export default commentSlice.reducer;
