import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types';
import { mockTasks } from '@/data/mockTasks';

// In a real app, this would be stored in a database
const tasks: Task[] = [...mockTasks];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const childId = searchParams.get('childId');

    let filteredTasks = tasks;

    // Apply filters
    if (category && category !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category === category);
    }
    if (priority && priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (childId) {
      filteredTasks = filteredTasks.filter(task => task.childId === childId);
    }

    // Sort by created date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      category: taskData.category || 'other',
      priority: taskData.priority || 'medium',
      status: 'todo',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      childId: taskData.childId,
      tags: taskData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: taskData.estimatedTime,
      recurrence: taskData.recurrence,
    };

    tasks.unshift(newTask);

    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
