import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types';
import { mockTasks } from '@/data/mockTasks';

// In a real app, this would be stored in a database
const tasks: Task[] = [...mockTasks];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = tasks.find(t => t.id === params.id);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskData = await request.json();
    const taskIndex = tasks.findIndex(t => t.id === params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...taskData,
      id: params.id, // Ensure ID doesn't change
      updatedAt: new Date(),
      completedAt: taskData.status === 'completed' ? new Date() : tasks[taskIndex].completedAt,
    };

    tasks[taskIndex] = updatedTask;

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskIndex = tasks.findIndex(t => t.id === params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
