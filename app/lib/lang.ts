const statusLabels = {
  publish: 'Publish',
  pending_review: 'Pending review',
  review_required: 'Review required',
  approved: 'Approved',
};

export const statusLabel = (s: string) => {
  switch (s) {
    case 'publish':
      return 'Published';
    case 'pending_review':
      return 'Pending review';
    case 'review_required':
      return 'Review required';
    case 'approved':
      return 'Approved';
    default:
      return s;
  }
};
