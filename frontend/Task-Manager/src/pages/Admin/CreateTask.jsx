import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import toast from 'react-hot-toast';

import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

import SelectDropdown from '../../components/inputs/SelectDropdown';
import SelectUsers from '../../components/inputs/SelectUsers';
import AvatarGroup from '../../components/layouts/AvatarGroup';
import TodoListInput from '../../components/inputs/TodoListInput';
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import Modal from '../../components/Modal';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // Added currentTask state

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task created Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });
        
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(), 
        todoChecklist: todolist,
        }
      ); // Added closing parenthesis for axiosInstance.put call
      toast.success("Task Updated Successfully");
    } catch (err) {
      console.error("Error creating task: ",err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!taskData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!taskData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!taskData.dueDate) {
      setError('Due Date is required');
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError('Task not assigned to any member');
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError('Add at least one checklist item');
      return;
    }
    if (taskId) {
      updateTask();
      return;
    } 

    createTask();
  };

  const getTaskDetailsByID = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (res?.data) {
        const taskInfo = res.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description, 
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
          ? moment (taskInfo.dueDate).format("YYYY-MM-DD")
          : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [], 
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (err) {
      console.error("Error fetching users:",err);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Expense details deleted sucessfully");
      navigate('/admin/tasks')
    } catch (err) {
      console.error(
        "Error deleteing expense:",
        err.response?.data?.message || error.message);
    }
  };

  useEffect(()=>{
    if(taskId){
      getTaskDetailsByID(taskId)
    }

    return () => {

    };
  }, [taskId])

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="ml-4 mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) => handleValueChange('title', target.value)}
              />
            </div>

            {/* Add More Fields as needed: description, priority, due date, etc. */}
            <div className="ml-4 mt-4">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe the task..."
                value={taskData.description}
                onChange={({ target }) => handleValueChange('description', target.value)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md: col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority 
                </label>
                <SelectDropdown
                  options= {PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)} 
                  placeholder="Select Priority"
                  /> 
              </div>
              <div className="col-span-6 md:col-span-4"> 
              <label className="text-xs font-medium text-slate-600">
                Due Date
                </label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.dueDate}
                onChange={({ target }) =>
                  handleValueChange("dueDate", target.value)
              }
              type="date"
              />
              </div>
              <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600"> 
                    Assign To 
                  </label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) => {
                  handleValueChange("assignedTo", value);
              }}
              />
              </div>
            </div>

            {/* TODO Checklist */}
            <div className="mt-3">
                <label className='text-xs font-medium text-slate-600'>
                  TODO Checklist
                </label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value)=>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            
            <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Add Attachments
                </label>
            
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
              }
              />
            </div>
            
            { error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p> 
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-7">
              <button
                onClick={handleSubmit}
                className="add-btn"
                disabled={loading}
              >
                {taskId ? 'Update Task' : 'Create Task'}
              </button>
              
            </div>
          </div>
        </div>
      </div>

      
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
        >
      <DeleteAlert
        content="Are you sure you want to delete this task?" 
        onDelete={() => deleteTask()}
      /> 
      </Modal>

    </DashboardLayout>
  );
};

export default CreateTask;
