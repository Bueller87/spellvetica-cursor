import React from 'react';

export function Layout(props: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="sv-app">
      <header className="sv-header">
        <div className="sv-headerRow">
          <h1 className="sv-title">{props.title}</h1>
          <div className="sv-headerRight">{props.right}</div>
        </div>
      </header>
      <main className="sv-main">{props.children}</main>
    </div>
  );
}

