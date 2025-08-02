import React from 'react';
import moment from 'moment';

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pending':
        return 'bg-purple-100 text-purple-500 border border-purple-200';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-500 border border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-500 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg mt-3 shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left text-[13px] text-gray-800 border-b border-gray-200">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Priority</th>
            <th className="py-3 px-4 hidden md:table-cell">Created On</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500 text-sm">
                No tasks available.
              </td>
            </tr>
          ) : (
            tableData.map((task) => (
              <tr key={task._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-4 text-[13px] text-gray-700 line-clamp-1">{task.title}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${getStatusBadgeColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${getPriorityBadgeColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 px-4 text-[13px] text-gray-600 hidden md:table-cell">
                  {task.createdAt ? moment(task.createdAt).format('Do MMM YYYY') : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
