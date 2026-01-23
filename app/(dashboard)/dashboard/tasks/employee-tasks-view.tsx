"use client";

import { Task } from "@/types/tasks";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { TasksTable } from "./tasks-table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmployeeTasksViewProps {
  tasks: Task[];
  users: User[];
}

export function EmployeeTasksView({ tasks, users }: EmployeeTasksViewProps) {
  // Group tasks by user
  const tasksByUser: Record<string, Task[]> = {};
  const unassignedTasks: Task[] = [];

  tasks.forEach((task) => {
    if (task.assigned_to) {
      if (!tasksByUser[task.assigned_to]) {
        tasksByUser[task.assigned_to] = [];
      }
      tasksByUser[task.assigned_to].push(task);
    } else {
      unassignedTasks.push(task);
    }
  });

  // State for expanded cards
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const toggleUser = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const getUserName = (user: User) => {
    return (
      user.user_metadata?.full_name ||
      `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
      user.email ||
      "Unknown User"
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Unassigned Tasks */}
      {unassignedTasks.length > 0 && (
        <Card className="overflow-hidden border-dashed">
           <div 
            className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors" 
            onClick={() => toggleUser("unassigned")}
           >
              <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                 </div>
                 <div>
                    <CardTitle className="text-lg">Unassigned Tasks</CardTitle>
                    <p className="text-sm text-muted-foreground">{unassignedTasks.length} tasks need assignment</p>
                 </div>
              </div>
              <Button variant="ghost" size="sm">
                {expandedUsers.has("unassigned") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
           {expandedUsers.has("unassigned") && (
             <div className="border-t">
               <CardContent className="pt-6">
                 <TasksTable tasks={unassignedTasks} users={users} />
               </CardContent>
             </div>
           )}
        </Card>
      )}

      {/* Employee Lists */}
      {users.map((user) => {
        const userTasks = tasksByUser[user.id] || [];
        const isExpanded = expandedUsers.has(user.id);
        const name = getUserName(user);

        // Stats
        const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
        const blocked = userTasks.filter(t => t.status === 'Blocked').length;
        const highPriority = userTasks.filter(t => t.priority === 'High').length;

        return (
          <Card key={user.id} className="overflow-hidden">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleUser(user.id)}
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                 {/* Task Summary Badges - Only show if tasks exist */}
                 {userTasks.length > 0 ? (
                    <div className="hidden md:flex gap-2 items-center">
                        {highPriority > 0 && <Badge variant="destructive">{highPriority} High Priority</Badge>}
                        {blocked > 0 && <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">{blocked} Blocked</Badge>}
                        {inProgress > 0 && <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{inProgress} In Progress</Badge>}
                        <Badge variant="outline">{userTasks.length} Total</Badge>
                    </div>
                 ) : (
                    <span className="text-sm text-muted-foreground italic hidden md:block">No tasks assigned</span>
                 )}

                <Button variant="ghost" size="icon">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {isExpanded && (
               <div className="border-t">
                  <CardContent className="pt-6">
                    {userTasks.length > 0 ? (
                        <TasksTable tasks={userTasks} users={users} />
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No tasks assigned to this employee.
                        </div>
                    )}
                  </CardContent>
               </div>
            )}
          </Card>
        );
      })}

      {/* Tasks for Unknown/Deleted Users */}
      {Object.keys(tasksByUser).map(userId => {
          if (users.find(u => u.id === userId)) return null; // Already handled
          const unknownUserTasks = tasksByUser[userId];
          const isExpanded = expandedUsers.has(userId);

          return (
            <Card key={userId} className="overflow-hidden border-dashed border-yellow-200 bg-yellow-50/10">
                <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors" 
                onClick={() => toggleUser(userId)}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                            ?
                        </div>
                        <div>
                            <CardTitle className="text-lg text-yellow-700">Unknown User ({userId.slice(0, 8)}...)</CardTitle>
                            <p className="text-sm text-yellow-600/80">{unknownUserTasks.length} tasks assigned to a missing or deleted user</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
                {isExpanded && (
                    <div className="border-t border-yellow-200">
                        <CardContent className="pt-6">
                            <TasksTable tasks={unknownUserTasks} users={users} />
                        </CardContent>
                    </div>
                )}
            </Card>
          );
      })}
    </div>
  );
}
