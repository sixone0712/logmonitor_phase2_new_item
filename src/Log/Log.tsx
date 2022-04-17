import { LazyLog, ScrollFollow } from "react-lazylog";

export default function Log() {
  return (
    <div style={{ height: 500, width: 1000 }}>
      <ScrollFollow
        startFollowing
        render={({ onScroll, follow, startFollowing, stopFollowing }) => (
          <LazyLog
            extraLines={1}
            enableSearch
            url={"http://localhost:8080/download"}
            stream
            // onScroll={onScroll}
            follow={follow}
          />
        )}
      />
    </div>
  );
}
