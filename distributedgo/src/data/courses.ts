export interface Day {
  id: string;
  title: string;
  content: string;
}

export interface Track {
  id: string;
  title: string;
  color: string; // hex or css var
  description: string;
  days: Record<string, Day>;
}

export const courses: Record<string, Track> = {
  kafka: {
    id: 'kafka',
    title: 'Kafka Architecture',
    color: 'var(--color-kafka)',
    description: 'Master high-throughput, fault-tolerant systems.',
    days: {
      '0': {
        id: '0',
        title: "Overview & Prerequisites",
        content: `
          <div class="course-intro fade-in"> 
              <h1>Architecting Event-Driven Systems</h1> 
              <p class="lead">
                  Welcome to the DistributedGo Kafka track. This course is for developers who build systems that never sleep. 
                  We focus on the intersection of Kafka internals and Go's concurrency model.
              </p> 
              <div class="grid-2">
                  <div class="card">
                      <h4 style="color: var(--color-kafka)">Distributed Fundamentals</h4>
                      <p>Understanding the Log abstraction, Partitioning logic, and the trade-offs between Throughput and Latency.</p>
                  </div>
                  <div class="card">
                      <h4 style="color: var(--color-go)">Go Mastery</h4>
                      <p>Leveraging Goroutines and Channels to handle millions of events without blocking the runtime.</p>
                  </div>
              </div>
              <div class="section">
                <h3>Prerequisites</h3>
                <ul>
                  <li>Strong understanding of <code>context.Context</code> and <code>channels</code>.</li>
                  <li>Familiarity with Protobuf/Avro serialization.</li>
                  <li>Docker and basic networking (TCP/IP stack).</li>
                </ul>
              </div>
          </div>`
      },
      '1': {
        id: '1',
        title: "Day 1: The Engine & Storage",
        content: `
          <div class="lesson-content fade-in"> 
              <h2>The Storage Engine & I/O Path</h2>
              <div class="sections">
                  <div class="section">
                      <h3>Hour 1: Sequential I/O & Pagecache</h3>
                      <p>Kafka treats the OS as its database. By using <strong>Sequential Appends</strong>, it turns random access disk patterns into sequential ones, which is nearly as fast as RAM on SSDs.</p>
                      <p><strong>Kernel Mechanics:</strong> Kafka uses <code>mmap</code> for index files and <code>sendfile(2)</code> for the data path. <code>sendfile</code> bypasses the application layer, moving data directly from the kernel read buffer to the network socket via DMA.</p>
                  </div>
                  <div class="section">
                      <h3>Hour 2: Log Compaction & KRaft</h3>
                      <p><strong>Compaction:</strong> Unlike "delete" retention, compaction keeps the latest value for every key. This is the foundation for <strong>Event Sourcing</strong>.</p>
                      <p><strong>KRaft Consensus:</strong> The Zookeeper era is over. Kafka now uses a Raft-based internal quorum. The <code>__cluster_metadata</code> partition stores the state of the world, replayed by all brokers to ensure a unified view without external dependency.</p>
                  </div>
                  <div class="section">
                      <h3>Hour 3: Lab - Raw Log Inspection</h3>
                      <div class="code-block">
                          <pre><code class="language-bash"># Connect to VM and inspect raw bytes
cd /var/lib/kafka/data/events-0

# Check the index file mapping offsets to physical positions
kafka-dump-log.sh --files 00000000000000000000.index --index-sanity-check

# View the actual message batch headers
kafka-dump-log.sh --files 00000000000000000000.log --print-data-log --deep-iteration</code></pre>
                      </div>
                  </div>
              </div>
          </div>`
      },
      '2': {
        id: '2',
        title: "Day 2: Protocol & Replication",
        content: `
          <div class="lesson-content fade-in">
              <h2>Distributed Replication Protocol</h2>
              <div class="sections">
                <div class="section">
                  <h3>Hour 1: ISR, HW, and LEO</h3>
                  <p><strong>LEO:</strong> Log End Offset (Leader's tail).</p>
                  <p><strong>HW:</strong> High Watermark (Last offset synced to all ISRs).</p>
                  <p><strong>Replication Loop:</strong> Followers send <code>FetchRequests</code> to the leader. The leader updates its ISR list based on the <code>replica.lag.time.max.ms</code> parameter. If a follower is too slow, it's kicked out of ISR to maintain write availability.</p>
                </div>
                <div class="section">
                  <h3>Hour 2: Request Purgatory</h3>
                  <p>When you set <code>acks=all</code>, the request doesn't return until all ISRs have acknowledged. Kafka uses a <strong>Hierarchical Timing Wheel</strong> to track these pending requests without blocking threads.</p>
                  <p>Watched objects trigger completion when the HW increments past the producer's offset.</p>
                </div>
                <div class="section">
                  <h3>Hour 3: Lab - Lag Simulation</h3>
                  <div class="code-block">
                    <pre><code class="language-bash"># Watch the ISR shrink in real-time
watch -n 1 "kafka-topics.sh --describe --topic critical-data --bootstrap-server localhost:9092"

# 1. Start a producer with acks=all
# 2. Stop one broker
# 3. Observe the ISR list update and the producer latency impact
</code></pre>
                  </div>
                </div>
              </div>
          </div>`
      },
      '3': {
        id: '3',
        title: "Day 3: Go Producers in Depth",
        content: `
          <div class="lesson-content fade-in">
              <h2 style="color: var(--color-go)">Mastering Go Producers</h2>
              <div class="sections">
                <div class="section">
                  <h3>Hour 1: segmentio vs confluent</h3>
                  <p><strong>segmentio/kafka-go:</strong> Pure Go. Idiomatic. Easier to debug and cross-compile. Perfect for microservices.</p>
                  <p><strong>confluent-kafka-go:</strong> C-wrapper (librdkafka). Extremely high performance (1M+ msg/s). Requires CGO and complex builds.</p>
                </div>
                <div class="section">
                  <h3>Hour 2: The Accumulator Path</h3>
                  <p>A producer is just an <strong>Accumulator</strong>. It batches messages by partition. 
                  Increasing <code>linger.ms</code> allows the producer to wait for more messages before firing, which massively increases throughput at the cost of slight latency.</p>
                </div>
                <div class="section">
                  <h3>Hour 3: Lab - High Throughput Go</h3>
                  <div class="code-block">
                    <pre><code class="language-go">// segmentio/kafka-go Writer configuration
w := &kafka.Writer{
    Addr:         kafka.TCP("localhost:9092"),
    Topic:        "topic-A",
    Balancer:     &kafka.LeastBytes{},
    BatchSize:    100,
    BatchBytes:   1048576, // 1MB
    Async:        true,
    Completion: func(messages []kafka.Message, err error) {
        if err != nil { fmt.Printf("Failed to write: %v\n", err) }
    },
}</code></pre>
                  </div>
                </div>
              </div>
          </div>`
      },
      '4': {
        id: '4',
        title: "Day 4: Go Consumers & Groups",
        content: `
          <div class="lesson-content fade-in">
              <h2>Advanced Consumer Logic</h2>
              <div class="sections">
                <div class="section">
                   <h3>Hour 1: Rebalance Protocol</h3>
                   <p>Rebalancing is the "Stop the World" event. Kafka 2.4+ introduced <strong>Cooperative Sticky Assignors</strong>, which allow consumers to keep processing some partitions while others are moving, reducing downtime.</p>
                </div>
                <div class="section">
                   <h3>Hour 2: Offset Commit Strategies</h3>
                   <p>Don't use <code>enable.auto.commit</code> in production for critical data. It leads to <strong>At-most-once</strong> (data loss). Manually commit offsets only *after* the business logic has successfully processed the message.</p>
                </div>
                <div class="section">
                   <h3>Hour 3: Lab - Graceful Shutdown</h3>
                   <div class="code-block">
                     <pre><code class="language-go">// Handling context cancellation
ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
defer stop()

for {
    msg, err := r.FetchMessage(ctx)
    if err != nil { break } // context cancelled
    
    process(msg)
    
    // Commit only after processing
    if err := r.CommitMessages(ctx, msg); err != nil {
        log.Fatal("failed to commit:", err)
    }
}</code></pre>
                   </div>
                </div>
              </div>
          </div>`
      },
      '5': {
        id: '5',
        title: "Day 5: Reliability & Semantics",
        content: `
          <div class="lesson-content fade-in">
              <h2>Exactly-Once Semantics (EOS)</h2>
              <div class="sections">
                <div class="section">
                   <h3>Hour 1: Idempotency & PID</h3>
                   <p>Set <code>enable.idempotence=true</code>. The broker assigns a <strong>Producer ID (PID)</strong> and a sequence number to every batch. If the broker receives a SeqNum it already has, it drops the batch without erroring. This prevents duplicates from network retries.</p>
                </div>
                <div class="section">
                   <h3>Hour 2: Transactions & DLQs</h3>
                   <p>Transactions allow you to write to multiple topics and commit offsets atomically. If any part fails, the <strong>Transaction Coordinator</strong> rolls back all markers.</p>
                   <p><strong>DLQ:</strong> If a message causes a "poison pill" (unparseable), send it to a <code>topic.error</code> and commit the offset to prevent the consumer from stalling.</p>
                </div>
                <div class="section">
                   <h3>Hour 3: Lab - Transactional Go</h3>
                   <div class="code-block">
                     <pre><code class="language-go">// Using confluent-kafka-go for Transactions
p, _ := kafka.NewProducer(&kafka.ConfigMap{"transactional.id": "myID"})
p.InitTransactions(ctx)

p.BeginTransaction()
p.Produce(&kafka.Message{TopicPartition: tp, Value: val}, nil)
// ... update state
p.CommitTransaction(ctx)</code></pre>
                   </div>
                </div>
              </div>
          </div>`
      },
      '6': {
        id: '6',
        title: "Day 6: Schema & Performance",
        content: `
          <div class="lesson-content fade-in">
              <h2>Scaling to Millions</h2>
              <div class="sections">
                <div class="section">
                  <h3>Hour 1: Schema Registry</h3>
                  <p>Don't send raw JSON. Use <strong>Avro</strong> or <strong>Protobuf</strong>. The Schema Registry ensures that producers cannot send data that breaks consumers (Backwards/Forwards compatibility).</p>
                </div>
                <div class="section">
                  <h3>Hour 2: Go Performance Tuning</h3>
                  <p><strong>Parallel Consumption:</strong> Use a worker pool. A single consumer goroutine fetches batches, but 10 worker goroutines process the data. Use a <strong>Fan-out</strong> channel strategy.</p>
                  <p><strong>Tuning:</strong> Increase <code>ReadBuffer</code> and <code>WriteBuffer</code> to match the high BDP (Bandwidth Delay Product) of your network.</p>
                </div>
                <div class="section">
                   <h3>Hour 3: Lab - Benchmarking</h3>
                   <div class="code-block">
                     <pre><code class="language-bash"># Kafka performance test tool
kafka-producer-perf-test.sh \
  --topic perf-test \
  --num-records 1000000 \
  --record-size 1024 \
  --throughput -1 \
  --producer-props bootstrap.servers=localhost:9092 linger.ms=20 compression.type=lz4</code></pre>
                   </div>
                </div>
              </div>
          </div>`
      },
      '7': {
        id: '7',
        title: "Day 7: Patterns & Production",
        content: `
          <div class="lesson-content fade-in">
              <h2 style="color: #3b82f6">Architectural Patterns</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: The Outbox Pattern</h3>
                    <p>Don't write to DB and Kafka in the same function (Distributed Transaction problem). Write to a <code>outbox</code> table in your DB, then have a separate process (CDC) poll that table and send to Kafka.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: Observability & Lag</h3>
                    <p>The most important metric is <strong>Consumer Lag</strong>. If Lag is increasing, your processing is slower than your production. Use <code>Burrow</code> or Prometheus to alert on Lag.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Final Challenge</h3>
                    <p>Design a <strong>Payment Verification Pipeline</strong>:</p>
                    <ol>
                      <li>Go service consumes <code>orders</code>.</li>
                      <li>Verifies balance via RPC.</li>
                      <li>Produces to <code>payment.success</code> or <code>payment.fail</code>.</li>
                      <li>Must handle retries and deduplication.</li>
                    </ol>
                 </div>
              </div>
          </div>`
      }
    }
  },
  go: {
    id: 'go',
    title: 'Go Expert Track',
    color: 'var(--color-go)',
    description: 'Master the Go Runtime and Scheduler.',
    days: {
      '0': {
        id: '0',
        title: "Overview",
        content: `
          <div class="course-intro fade-in">
              <div class="hero">
                  <h1>Expert Concurrency</h1>
                  <p class="lead">This is not a syntax course. We are dissecting the <code>src/runtime</code> package.</p>
              </div>
              <div class="card highlight-card">
                  <h3>The Runtime</h3>
                  <p>We explore the hidden machinery: The <code>sysmon</code> thread, the Write Barrier, the <code>findrunnable</code> state machine, and how the stack really grows.</p>
              </div>
          </div>`
      },
      '1': {
        id: '1',
        title: "Day 1: The Scheduler Internals",
        content: `
          <div class="lesson-content fade-in">
              <h2>The GMP Model Deep Dive</h2>
              <div class="sections">
                  <div class="section">
                      <h3>Hour 1: The Run Queues</h3>
                      <p><strong>Local Queue:</strong> Each P has a lock-free ring buffer for runnable Gs (capacity 256). Pushing/Popping is fast (atomic CAS).</p>
                      <p><strong>Global Queue:</strong> Protected by a mutex. Slower. Used when local queues overflow or for Gs coming from network poller.</p>
                      <p><strong>Scheduling Loop:</strong> <code>schedule()</code> -> <code>execute()</code> -> <code>gogo()</code> (assembly jump). Every 61 ticks, a P checks the Global Queue to ensure fairness.</p>
                  </div>
                  <div class="section">
                      <h3>Hour 2: Sysmon & Preemption</h3>
                      <p><code>sysmon</code> is a background thread (not bound to a P) that runs every 20us-10ms.</p>
                      <p><strong>Retaking P:</strong> If a syscall blocks an M for >10ms, sysmon retakes the P and gives it to another M.</p>
                      <p><strong>Preemption:</strong> If a G runs >10ms, sysmon sends a <code>SIGURG</code>. The signal handler injects an async preemption check, forcing the G to yield.</p>
                  </div>
                  <div class="section">
                      <h3>Hour 3: Lab - Tracing the Scheduler</h3>
                      <p>We will visualize work-stealing and preemption.</p>
                      <div class="code-block">
                          <pre><code class="language-go">package main
import ("runtime"; "time")

func main() {
    // 1 CPU to force contention
    runtime.GOMAXPROCS(1) 
    
    go func() {
        for { 
            // Tight loop - used to hang scheduler before Go 1.14
        }
    }()
    
    time.Sleep(1 * time.Second)
    println("I ran! Preemption works.")
}
// Run with: GODEBUG=schedtrace=1000 go run main.go
</code></pre>
                      </div>
                  </div>
              </div>
          </div>`
      },
      '2': {
        id: '2',
        title: "Day 2: Memory & GC",
        content: `
          <div class="lesson-content fade-in">
              <h2>The Garbage Collector</h2>
              <div class="sections">
                <div class="section">
                   <h3>Hour 1: Tricolor Mark & Sweep</h3>
                   <p>Go uses a concurrent, concurrent-mark, concurrent-sweep GC.</p>
                   <ul>
                     <li><strong>Write Barrier:</strong> When pointers are modified during the Mark phase, the barrier shades the object "Grey" to prevent the collector from missing a reference moved to a "Black" object.</li>
                     <li><strong>Assist:</strong> If allocation rate > scan rate, the allocating G is forced to do GC work (Mutator Assist). Latency penalty!</li>
                   </ul>
                </div>
                <div class="section">
                   <h3>Hour 2: Escape Analysis</h3>
                   <p>The compiler decides Stack vs Heap. <code>go build -gcflags="-m"</code> reveals the decision.</p>
                   <p><strong>Pointers are dangerous:</strong> Returning a pointer to a local variable forces it to the Heap. Passing large structs by value is often cheaper (stack copy) than by pointer (GC pressure).</p>
                </div>
                <div class="section">
                   <h3>Hour 3: GC Tuning Lab</h3>
                   <p>Using <code>GOGC</code> and the Memory Ballast pattern.</p>
                   <div class="code-block">
                     <pre><code class="language-go">// The "Ballast"
// Allocate a large byte slice to trick the GC into triggering less often.
ballast := make([]byte, 10<<30) // 10GB (virtual memory, not physical RSS)

// This increases the heap base, so GOGC (default 100%) triggers 
// only when we add *another* 10GB of garbage. 
// Massive latency reduction for API servers.
</code></pre>
                   </div>
                </div>
              </div>
          </div>`
      },
      '3': {
        id: '3',
        title: "Day 3: Channels & Select",
        content: `
          <div class="lesson-content fade-in">
              <h2>Channel Internals</h2>
              <div class="sections">
                <div class="section">
                  <h3>Hour 1: The Sudog</h3>
                  <p>When a G blocked on a channel, it is wrapped in a <code>sudog</code> struct and placed on the channel's <code>recvq</code> or <code>sendq</code> linked list.</p>
                  <p><strong>Parking:</strong> The G calls <code>gopark()</code>, sets its status to <code>Gwaiting</code>, and unlinks from the M. The M picks the next G.</p>
                </div>
                <div class="section">
                  <h3>Hour 2: Select Implementation</h3>
                  <p><code>select</code> sorts all cases by channel address (to prevent locking deadlocks) then locks all channels.</p>
                  <p>If no channel is ready and there is no default, the G puts itself on the wait queues of <strong>ALL</strong> involved channels and parks.</p>
                  <p>The first channel to wake up the G locks the G, removes it from all other wait queues (CAS), and unparks it.</p>
                </div>
                <div class="section">
                  <h3>Hour 3: Nil Channel Pattern</h3>
                  <div class="code-block">
                    <pre><code class="language-go">// Dynamically disabling cases in a select loop
func merge(a, b <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for a != nil || b != nil {
            select {
            case v, ok := <-a:
                if !ok { a = nil; continue } // Disable this case!
                out <- v
            case v, ok := <-b:
                if !ok { b = nil; continue }
                out <- v
            }
        }
        close(out)
    }()
    return out
}
</code></pre>
                  </div>
                </div>
              </div>
          </div>`
      },
      '4': {
        id: '4',
        title: "Day 4: Sync Primitives",
        content: `
          <div class="lesson-content fade-in">
              <h2>Advanced Sync</h2>
              <div class="sections">
                <div class="section">
                   <h3>Hour 1: sync.Pool Internals</h3>
                   <p><code>sync.Pool</code> is designed to reduce GC pressure. It has a "victim cache".</p>
                   <p>Data is stored in per-P local pools (lock-free access). During GC, the pool is cleared (moved to victim). If you don't use the item before the next GC, it's freed.</p>
                   <p><strong>Warning:</strong> Do not store database connections in <code>sync.Pool</code>. They will be closed randomly.</p>
                </div>
                <div class="section">
                   <h3>Hour 2: runtime.KeepAlive</h3>
                   <p>The GC is aggressive. If you have a <code>Finalizer</code> on a struct, and the last line of code using that struct executes, the GC might collect it <em>before</em> the function returns!</p>
                   <p>Use <code>runtime.KeepAlive(x)</code> to guarantee <code>x</code> lives until that point. Critical for CGO resources.</p>
                </div>
                <div class="section">
                   <h3>Hour 3: Singleflight Lab</h3>
                   <p>Prevent cache stampedes using <code>golang.org/x/sync/singleflight</code>.</p>
                   <div class="code-block">
                     <pre><code class="language-go">var g singleflight.Group

func getCachedData(key string) string {
    v, _, _ := g.Do(key, func() (interface{}, error) {
        // This runs only ONCE even if 1000 goroutines call getCachedData concurrently
        return callDatabase(key), nil
    })
    return v.(string)
}
</code></pre>
                   </div>
                </div>
              </div>
          </div>`
      },
      '5': {
        id: '5',
        title: "Day 5: Networking",
        content: `
          <div class="lesson-content fade-in">
              <h2>The Network Poller</h2>
              <div class="sections">
                <div class="section">
                  <h3>Hour 1: Non-blocking I/O</h3>
                  <p>Go uses non-blocking sockets. When you call <code>conn.Read()</code>, if it returns <code>EAGAIN</code>, the runtime parks the G and registers the file descriptor with epoll/kqueue.</p>
                  <p>The <strong>Network Poller</strong> (running on its own thread or integrated into the scheduler) wakes up when the OS signals data is ready, and unparks the G.</p>
                </div>
                <div class="section">
                  <h3>Hour 2: Netpoll Integration</h3>
                  <p>The scheduler checks the network poller for ready Gs:
                  1. During \`schedule()\` (1/61 chance).
                  2. When the Global Queue is empty.
                  3. During sysmon execution.</p>
                  <p>This allows Go to handle 100k+ connections with few OS threads.</p>
                </div>
                <div class="section">
                  <h3>Hour 3: TCP Tuning Lab</h3>
                  <div class="code-block">
                    <pre><code class="language-go">// Setting KeepAlive and buffers
d := net.Dialer{
    KeepAlive: 30 * time.Second,
}
conn, _ := d.Dial("tcp", "host:port")
tcpConn := conn.(*net.TCPConn)
tcpConn.SetWriteBuffer(128 * 1024)
tcpConn.SetNoDelay(true) // Disable Nagle's algorithm (latency vs bandwidth)
</code></pre>
                  </div>
                </div>
              </div>
          </div>`
      },
      '6': {
        id: '6',
        title: "Day 6: Profiling",
        content: `
          <div class="lesson-content fade-in">
              <h2>Deep Profiling</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: Contention Profiling</h3>
                    <p><code>go test -bench . -mutexprofile=mutex.out</code></p>
                    <p>This shows code paths holding locks that block other goroutines. Critical for debugging "latency tail" issues.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: PGO (Profile Guided Optimization)</h3>
                    <p>New in Go 1.20+. You feed a <code>cpu.pprof</code> file back into the compiler.</p>
                    <p>The compiler uses this to inline hot functions and devirtualize interface calls, often yielding 5-10% free performance.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Execution Tracer Lab</h3>
                    <p>Debugging a "Stop the World" pause.</p>
                    <div class="code-block">
                       <pre><code class="language-bash"># Capture trace
curl -o trace.out http://localhost:6060/debug/pprof/trace?seconds=5

# View
go tool trace trace.out
# Look for the "GC" row. 
# "STW: Sweep Termination" -> Start of GC.
# "STW: Mark Termination" -> End of GC.
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '7': {
        id: '7',
        title: "Day 7: Final Exam",
        content: `
          <div class="lesson-content fade-in">
              <h2>Architect Challenge</h2>
              <div class="sections">
                 <div class="section">
                    <h3>The Challenge</h3>
                    <p>Build a <strong>Rate-Limited Priority Worker Pool</strong>.</p>
                    <ul>
                      <li><strong>Inputs:</strong> A stream of Jobs with Priority (0-255).</li>
                      <li><strong>Constraint 1:</strong> Max 10 concurrent workers.</li>
                      <li><strong>Constraint 2:</strong> Max 100 jobs processed per second (Token Bucket).</li>
                      <li><strong>Constraint 3:</strong> High priority jobs must preempt low priority jobs if queue is full.</li>
                    </ul>
                 </div>
                 <div class="section">
                    <h3>Architecture</h3>
                    <p>Use 3 channels (High, Med, Low). Select loop with priority (check High, then default to Med, etc). Use <code>golang.org/x/time/rate</code>.</p>
                 </div>
                 <div class="section">
                    <h3>Code Skeleton</h3>
                    <div class="code-block">
                       <pre><code class="language-go">type Job struct {
    Priority int
    Payload  func()
}

func Dispatcher(high, low <-chan Job, limit *rate.Limiter) {
    for {
        limit.Wait(context.Background()) // Rate Limit
        select {
        case j := <-high:
            go process(j)
        default:
            select {
            case j := <-high:
                go process(j)
            case j := <-low:
                go process(j)
            }
        }
    }
}
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      }
    }
  },
  redis: {
    id: 'redis',
    title: 'Redis Distributed',
    color: 'var(--color-redis)',
    description: 'In-memory data structures and distributed caching patterns.',
    days: {
      '0': {
        id: '0',
        title: "Overview",
        content: `
          <div class="course-intro fade-in">
              <h1>Redis for Architects</h1>
              <p class="lead">It is not just a cache. It is a shared-state engine.</p>
              <div class="card">
                <h3>The Event Loop</h3>
                <p>Why is Redis single-threaded? We dissect the <code>epoll</code> loop, file events vs time events, and the cost of the context switch.</p>
              </div>
          </div>`
      },
      '1': {
        id: '1',
        title: "Day 1: Internals",
        content: `
          <div class="lesson-content fade-in">
              <h2>The Engine</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: The Event Loop (ae.c)</h3>
                    <p>Redis uses an infinite loop <code>aeMain</code>.</p>
                    <ol>
                      <li>Determine timeout (nearest "Time Event" e.g., eviction).</li>
                      <li>Wait for "File Events" (Sockets) via <code>epoll_wait</code>.</li>
                      <li>Process ready sockets (Read query -> Execute -> Write buffer).</li>
                      <li>Process Time Events.</li>
                    </ol>
                    <p><strong>Bottleneck:</strong> If one command takes 5ms, throughput drops to max 200 ops/sec. Blocking is fatal.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: Dictionary Rehashing</h3>
                    <p>The Global Hash Table (dict). When it grows, Redis expands the table size (power of 2).</p>
                    <p><strong>Incremental Rehashing:</strong> To avoid freezing during a resize of 10M keys, Redis rehashes 100 buckets every 1ms (in the cron) or during lookups. It maintains two tables (ht[0], ht[1]) during the migration.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Lab - Latency Doctor</h3>
                    <div class="code-block">
                       <pre><code class="language-bash"># Analyze latency spikes
redis-cli --latency-history

# See what commands are taking time (run in prod!)
redis-cli COMMANDSTATS
# Look for 'usec_per_call'

# Check for forked process (RDB) taking CPU
redis-cli INFO stats | grep latest_fork_usec
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '2': {
        id: '2',
        title: "Day 2: Data Structures",
        content: `
          <div class="lesson-content fade-in">
              <h2>Advanced Structures</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: Ziplists & Packlists</h3>
                    <p>To save memory (pointers are 8 bytes!), Redis compresses small lists/hashes into a byte array (ziplist).</p>
                    <p>It's O(N) to search, but for N < 100, linear scan of contiguous RAM is faster than pointer chasing (cache misses). Config: <code>hash-max-ziplist-entries 512</code>.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: HyperLogLog & Bloom Filters</h3>
                    <p><strong>HLL:</strong> Count unique users (cardinality) with 12KB memory and 0.81% error. Magic of Probabilistic Counting.</p>
                    <p><strong>Bloom Filter (RedisStack):</strong> "Does this key exist?" Returns "No" or "Probably". Eliminates DB hits for non-existent keys.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Memory Lab</h3>
                    <div class="code-block">
                       <pre><code class="language-bash"># Compare memory usage
# 1. Store 1000 items in a Hash (ziplist)
HSET myhash field1 "val" ...

# 2. Store 1000 items as separate Keys
SET key1 "val" ...

# 3. Analyze
redis-cli --memkeys
# Ziplist is often 10x smaller.
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '3': {
        id: '3',
        title: "Day 3: Reliability",
        content: `
          <div class="lesson-content fade-in">
              <h2>Persistence & Safety</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: Fork & COW</h3>
                    <p>BGSAVE calls <code>fork()</code>. The parent continues. The OS uses <strong>Copy-On-Write</strong> pages.</p>
                    <p><strong>Danger:</strong> If you have 16GB RAM used and write traffic is high, COW will duplicate pages, potentially causing OOM (Out of Memory). Always leave 50% RAM free for COW overhead.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: AOF Fsync Policies</h3>
                    <p><code>appendfsync always</code>: Safe but slow (disk seek per write).</p>
                    <p><code>appendfsync everysec</code>: Buffer writes, flush every 1s. The sweet spot.</p>
                    <p><strong>The Stall:</strong> If disk is slow, the <code>fsync</code> call (in background thread) blocks. The main thread will <strong>BLOCK</strong> if the background fsync takes > 2 seconds to ensure data safety. Latency spike!</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: AOF Analysis Lab</h3>
                    <div class="code-block">
                       <pre><code class="language-bash"># Inspect the AOF protocol
cat appendonly.aof
# It is just raw RESP commands!

# Fix a corrupt AOF
redis-check-aof --fix appendonly.aof
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '4': {
        id: '4',
        title: "Day 4: Distributed Locks",
        content: `
          <div class="lesson-content fade-in">
              <h2>The Redlock Algorithm</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: The Single Instance Lock</h3>
                    <p><code>SET resource_name my_random_value NX PX 30000</code></p>
                    <p><strong>Release:</strong> Lua script. Check if value matches <code>my_random_value</code> before DEL. This prevents deleting a lock acquired by another client after yours expired.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: Distributed Redlock</h3>
                    <p>Acquire lock on N instances (e.g., 5). If acquired on >= 3 (majority), lock is valid.</p>
                    <p><strong>Controversy:</strong> Relies on clock synchronization. If clocks jump, safety is violated (Martin Kleppmann's critique).</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Lua Locking Lab</h3>
                    <div class="code-block">
                       <pre><code class="language-lua">-- Safe Release Script
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '5': {
        id: '5',
        title: "Day 5: Clustering",
        content: `
          <div class="lesson-content fade-in">
              <h2>Redis Cluster Mechanics</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: Gossip Protocol</h3>
                    <p>Nodes ping each other to exchange state (FAIL, PFAIL). They use a separate port (port + 10000) for the Cluster Bus.</p>
                    <p><strong>Bandwidth:</strong> In large clusters, gossip traffic can saturate the NIC. Tune <code>cluster-node-timeout</code>.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: Client Smart Routing</h3>
                    <p>The client caches the "Slot Map".</p>
                    <p>If a migration happens, the node returns <code>ASK</code> (ask the new node, but slot not fully migrated) or <code>MOVED</code> (slot permanently migrated, update map).</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Resharding Lab</h3>
                    <div class="code-block">
                       <pre><code class="language-bash"># Live Resharding
redis-cli --cluster reshard 127.0.0.1:7000
# It asks: How many slots? From ID? To ID?
# Watch the client handle the ASK/MOVED redirects transparently.
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '6': {
        id: '6',
        title: "Day 6: Advanced Patterns",
        content: `
          <div class="lesson-content fade-in">
              <h2>Functional Redis</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: Rate Limiting (Token Bucket)</h3>
                    <p>Naive approach (GET + INCR) has race conditions. Use Lua.</p>
                    <p>Script: Get current tokens. Add tokens based on time elapsed. If tokens > 1, decrement and allow. Write back.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: Secondary Indexing</h3>
                    <p>Redis is Key-Value. How to find "Users by Age"?</p>
                    <p>Use a <strong>Sorted Set</strong> (ZSET). Score = Age, Member = UserID. <code>ZRANGEBYSCORE users 20 30</code>.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Lua Scripting Lab</h3>
                    <div class="code-block">
                       <pre><code class="language-lua">-- Atomic Rate Limit
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0 -- Rejected
else
    redis.call("INCR", key)
    redis.call("EXPIRE", key, 1) -- 1 sec window
    return 1 -- Allowed
end
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      },
      '7': {
        id: '7',
        title: "Day 7: Scaling",
        content: `
          <div class="lesson-content fade-in">
              <h2>Massive Scale</h2>
              <div class="sections">
                 <div class="section">
                    <h3>Hour 1: Cache Stampede</h3>
                    <p>Also known as "Dogpiling". 1000 requests hit a missing key. All 1000 hit the DB. DB dies.</p>
                    <p><strong>Solution 1:</strong> Locking (Redlock) - only one rebuilds cache.</p>
                    <p><strong>Solution 2:</strong> Probabilistic Early Expiration (PER). X-Fetch. Recompute cache <em>before</em> it expires (probabilistically) to keep it fresh.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 2: Client Side Caching</h3>
                    <p>Redis 6 feature. Server tracks keys the client requested. If key changes, Server sends an "Invalidate" message to client.</p>
                    <p>Allows client to keep a local HashMap sync'd with Redis with near-zero latency.</p>
                 </div>
                 <div class="section">
                    <h3>Hour 3: Final Lab</h3>
                    <p>Simulating Network Partitions.</p>
                    <div class="code-block">
                       <pre><code class="language-bash"># Use iptables to block port 6379 for 30 seconds
iptables -A INPUT -p tcp --dport 6379 -j DROP

# Observe client timeouts
# Observe Sentinel failover logic (SDOWN -> ODOWN)
# Remove rule
iptables -D INPUT -p tcp --dport 6379 -j DROP
</code></pre>
                    </div>
                 </div>
              </div>
          </div>`
      }
    }
  }
};