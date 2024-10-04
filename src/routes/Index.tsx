import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AddTask from '../components/AddTask';
import Container from '../components/Container';
import { ITask } from '../models/interface';

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();

  const task: ITask = location.state?.task;

  useEffect(() => {
    if (!task) {
      navigate(location.pathname, {});
    }
  }, [location.pathname, navigate, task]);

  return (
    <Container title="AI-enhanced, Voice-enable, Searchable Task Manager">
      <AddTask task={task} />
    </Container>
  );
}
