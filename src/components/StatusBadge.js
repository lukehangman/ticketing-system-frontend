'use client';

import { getStatusColor, capitalize } from '../lib/utils';

const StatusBadge = ({ status }) => {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {capitalize(status)}
    </span>
  );
};

export default StatusBadge;
