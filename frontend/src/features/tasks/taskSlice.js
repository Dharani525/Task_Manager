import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// ✅ Fetch All Tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/tasks');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.error || 'Failed to load tasks');
    }
  }
);

// ✅ CREATE Task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, thunkAPI) => {
    try {
      const res = await axios.post('/tasks', taskData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to create task');
    }
  }
);

// ✅ UPDATE Task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axios.put(`/tasks/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to update task');
    }
  }
);

// Example thunk
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await axios.patch(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.error || 'Failed to update task status');
    }
  }
);

// ✅ DELETE Task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/tasks/${id}`);
      return id; // Return only the deleted task id to update the state
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
        //  Status Patch
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.tasks = state.tasks.map(t => t._id === updatedTask._id ? updatedTask : t);
      })
    .addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    });


  },
});

export default taskSlice.reducer;
