# A Course in Combinatorial Optimization

## Alexander Schrijver

```
CWI,
Kruislaan 413,
1098 SJ Amsterdam,
The Netherlands
```
```
and
```
```
Department of Mathematics,
University of Amsterdam,
Plantage Muidergracht 24,
1018 TV Amsterdam,
The Netherlands.
```
```
March 23, 2017
copyright©c A. Schrijver
```

## Contents




###### 5

## 1. Shortest paths and trees

### 1.1. Shortest paths with nonnegative lengths

LetD = (V, A) be a directed graph, and lets, t∈V. A walkis a sequenceP =
(v 0 , a 1 , v 1 ,... , am, vm) whereaiis an arc fromvi− 1 tovifori= 1,... , m. Ifv 0 ,... , vm
all are different,Pis called apath.
Ifs=v 0 andt=vm, the verticessandtare thestartingandend vertexofP,
respectively, andPis called ans−twalk, and, ifPis a path, ans−tpath. The
lengthofPism. Thedistancefromstotis the minimum length of anys−tpath.
(If nos−tpath exists, we set the distance fromstotequal to∞.)
It is not difficult to determine the distance fromstot: LetVidenote the set of
vertices ofDat distanceifroms. Note that for eachi:

(1) Vi+1is equal to the set of verticesv∈V\(V 0 ∪V 1 ∪···∪Vi) for which
(u, v)∈Afor someu∈Vi.

This gives us directly an algorithm for determining the setsVi: we setV 0 :={s}and
next we determine with rule (1) the setsV 1 , V 2 ,.. .successively, untilVi+1=∅.
In fact, it gives a linear-time algorithm:

Theorem 1.1. The algorithm has running timeO(|A|).

Proof.Directly from the description.

In fact the algorithm finds the distance fromsto all vertices reachable froms.
Moreover, it gives the shortest paths. These can be described by a rooted (directed)
treeT= (V′, A′), with roots, such thatV′is the set of vertices reachable inDfrom
sand such that for eachu, v∈V′, each directedu−vpath inT is a shortestu−v
path inD.^1
Indeed, when we reach a vertextin the algorithm, we store the arc by whichtis
reached. Then at the end of the algorithm, all stored arcs form a rooted tree with
this property.
There is also a trivial min-max relation characterizing theminimum length of an
s−tpath. To this end, call a subsetA′ofAans−tcutifA′=δout(U) for some
subsetU ofV satisfying s∈U andt 6∈U.^2 Then the following was observed by
Robacker [1956]:

(^1) Arooted tree, withroots, is a directed graph such that the underlying undirected graph is a
tree and such that each vertext 6 =shas indegree 1. Thus each vertextis reachable fromsby a
unique directeds−tpath.
(^2) δout(U) andδin(U) denote the sets of arcs leaving and enteringU, respectively.


6 Chapter 1. Shortest paths and trees

Theorem 1.2.The minimum length of ans−tpath is equal to the maximum number
of pairwise disjoints−tcuts.

Proof.Trivially, the minimum is at least the maximum, since eachs−tpath intersects
eachs−tcut in an arc. The fact that the minimum is equal to the maximumfollows
by considering thes−tcutsδout(Ui) fori= 0,... , d−1, wheredis the distance from
stotand whereUiis the set of vertices of distance at mostifroms.

This can be generalized to the case where arcs have a certain ‘length’. For any
‘length’ functionl :A→Q+and any walkP = (v 0 , a 1 , v 1 ,... , am, vm), letl(P) be
the length ofP. That is:

(2) l(P) :=

```
∑m
```
```
i=
```
```
l(ai).
```
Now thedistancefromstot(with respect tol) is equal to the minimum length of
anys−tpath. If nos−tpath exists, the distance is +∞.

Again there is an easy algorithm, due to Dijkstra [1959], to find a minimum-length
s−tpath for allt. Start withU:=Vand setf(s) := 0 andf(v) =∞ifv 6 =s. Next
apply the following iteratively:

(3) Findu∈Uminimizingf(u) overu∈U. For eacha= (u, v)∈Afor which
f(v)> f(u) +l(a), resetf(v) :=f(u) +l(a). ResetU:=U\{u}.

We stop ifU=∅. Then:

Theorem 1.3.The final functionfgives the distances froms.

Proof. Let dist(v) denote the distance from sto v, for any vertex v. Trivially,
f(v)≥dist(v) for allv, throughout the iterations. We prove that throughout the
iterations,f(v) = dist(v) for eachv∈V\U. At the start of the algorithm this is
trivial (asU=V).
Consider any iteration (3). It suffices to show thatf(u) = dist(u) for the chosen
u∈U. Supposef(u)>dist(u). Lets=v 0 , v 1 ,... , vk=ube a shortests−upath.
Letibe the smallest index withvi∈U.

Thenf(vi) = dist(vi). Indeed, ifi= 0, thenf(vi) =f(s) = 0 = dist(s) = dist(vi).
Ifi >0, then (asvi− 1 ∈V\U):

(4) f(vi)≤f(vi− 1 ) +l(vi− 1 , vi) = dist(vi− 1 ) +l(vi− 1 , vi) = dist(vi).

This impliesf(vi)≤dist(vi)≤dist(u)< f(u), contradicting the choice ofu.


Section 1.1. Shortest paths with nonnegative lengths 7

Clearly, the number of iterations is|V|, while each iteration takesO(|V|) time.
So the algorithm has a running timeO(|V|^2 ). In fact, by storing for each vertexvthe
last arcafor which (3) applied we find a rooted treeT = (V′, A′) with rootssuch
thatV′is the set of vertices reachable fromsand such that ifu, v∈V′are such that
T contains a directedu−vpath, then this path is a shortestu−vpath inD.
Thus we have:

Theorem 1.4. Given a directed graphD= (V, A),s, t∈V, and a length function
l:A→Q+, a shortests−tpath can be found in timeO(|V|^2 ).

Proof.See above.

```
For an improvement, see Section 1.2.
A weighted version of Theorem 1.2 is as follows:
```
Theorem 1.5. LetD= (V, A)be a directed graph,s, t∈V, and let l:A→Z+.
Then the minimum length of ans−tpath is equal to the maximum numberkofs−t
cutsC 1 ,... , Ck(repetition allowed) such that each arcais in at mostl(a)of the cuts
Ci.

Proof.Again, the minimum is not smaller than the maximum, since ifPis anys−t
path andC 1 ,... , Ckis any collection as described in the theorem:^3

(5) l(P) =

###### ∑

```
a∈AP
```
```
l(a)≥
```
###### ∑

```
a∈AP
```
```
( number ofiwitha∈Ci)
```
###### =

```
∑k
```
```
i=
```
```
|Ci∩AP|≥
```
```
∑k
```
```
i=
```
```
1 =k.
```
To see equality, letdbe the distance fromstot, and letUibe the set of vertices
at distance less thanifroms, fori= 1,... , d. TakingCi:=δout(Ui), we obtain a
collectionC 1 ,... , Cdas required.

Application 1.1: Shortest path.Obviously, finding a shortest route between cities is an
example of a shortest path problem. The length of a connection need not be the geographical
distance. It might represent the time or energy needed to make the connection. It might
cost more time or energy to go fromAtoBthan fromBtoA. This might be the case, for
instance, when we take differences of height into account (when routing trucks), or air and
ocean currents (when routing airplanes or ships).
Moreover, a route for an airplane flight between two airportsso that a minimum amount
of fuel is used, taking weather, altitude, velocities, and air currents into account, can be

(^3) APdenotes the set of arcs traversed byP


```
8 Chapter 1. Shortest paths and trees
```
```
found by a shortest path algorithm (if the problem is appropriately discretized — otherwise
it is a problem of ‘calculus of variations’). A similar problem occurs when finding the
optimum route for boring say an underground railway tunnel.
```
```
Application 1.2: Dynamic programming. A company has to perform a job that will
take 5 months. For this job a varying number of extra employees is needed:
```
```
(6) month number of extra employees needed
1 b 1 =
2 b 2 =
3 b 3 =
4 b 4 =
5 b 5 =
```
```
Recruiting and instruction costs EUR 800 per employee, while stopping engagement costs
EUR 1200 per employee. Moreover, the company has costs of EUR1600 per month for
each employee that is engaged above the number of employees needed that month. The
company now wants to decide what is the number of employees tobe engaged so that the
total costs will be as low as possible.
Clearly, in the example in any monthi, the company should have at leastbiand at most
11 extra employees for this job. To solve the problem, make a directed graphD= (V,A)
with
```
```
(7) V :={(i,x)|i= 1,...,5;bi≤x≤ 11 }∪{(0,0),(6,0)},
A:={((i,x),(i+ 1,y))∈V×V |i= 0,..., 5 }.
```
```
(Figure 1.1).
At the arc from (i,x) to (i+ 1,y) we take as length the sum of
```
(8) (i) the cost of starting or stopping engagement when passing fromxtoyemployees
(this is equal to 8(y−x) ify≥xand to 12(x−y) ify < x);
(ii) the cost of keeping the surplus of employees in monthi+1 (that is, 16(y−bi+1))

```
(taking EUR 100 as unit).
Now the shortest path from (0,0) to (6,0) gives the number of employees for each month
so that the total cost will be minimized. Finding a shortest path is thus a special case of
dynamic programming.
```
```
Exercises
```
```
1.1. Solve the dynamic programming problem in Application 1.2 with Dijkstra’s method.
```

Section 1.2. Speeding up Dijkstra’s algorithm with heaps 9

```
8
64
```
```
40
```
```
24
```
```
64
72
60
48
```
```
40
```
```
48
```
```
24
```
```
28
```
```
12
```
```
16
```
```
40
```
```
24
```
```
48
```
(^5616)
32
(^5664)
40
32
44
16
12 36
28
40
8
16
24
104
80
132
36
32 48 0
0
56
0 1 2 3 4 5 6
0
7
8
9
10
11
44
52
Figure 1.

### 1.2. Speeding up Dijkstra’s algorithm with heaps

For dense graphs, a running time bound ofO(|V|^2 ) for a shortest path algorithm is
best possible, since one must inspect each arc. But if|A|is asymptotically smaller
than|V|^2 , one may expect faster methods.
In Dijkstra’s algorithm, we spendO(|A|) time on updating the valuesf(u) and
O(|V|^2 ) time on finding au∈Uminimizingf(u). As|A| ≤ |V|^2 , a decrease in the
running time bound requires a speed-up in finding auminimizingf(u).
A way of doing this is based on storing theuin some order so that auminimizing
f(u) can be found quickly and so that it does not take too much timeto restore the
order if we delete a minimizinguor if we decrease somef(u).
This can be done by using a ‘heap’, which is a rooted forest (U, F) onU, with the
property that if (u, v)∈Fthenf(u)≤f(v).^4 So at least one of the roots minimizes
f(u).
Let us first consider the 2-heap. This can be described by an orderingu 1 ,... , un

(^4) Arooted forestis an acyclic directed graphD= (V,A) such that each vertex has indegree at
most 1. The vertices of indegree 0 are called therootsofD. If (u,v)∈A, thenuis called theparent
ofvandvis called achildofu.
If the rooted forest has only one root, it is arooted tree.


10 Chapter 1. Shortest paths and trees

of the elements ofUsuch that ifi=⌊j 2 ⌋thenf(ui)≤f(uj). The underlying rooted
forest is in fact a rooted tree: its arcs are the pairs (ui, uj) withi=⌊j 2 ⌋.
In a 2-heap, one easily finds auminimizingf(u): it is the rootu 1. The following
theorem is basic for estimating the time needed for updatingthe 2-heap:

Theorem 1.6.Ifu 1 is deleted or if somef(ui)is decreased, the 2 -heap can be restored
in timeO(logp), wherepis the number of vertices.

Proof.To removeu 1 , perform the following ‘sift-down’ operation. Resetu 1 :=un
andn:=n−1. Leti= 1. While there is aj≤nwith 2i+ 1≤j≤ 2 i+ 2 and
f(uj)< f(ui), choose one with smallestf(uj), swapuianduj, and reseti:=j.
Iff(ui) has decreased perform the following ‘sift-up’ operation. Whilei >0 and
f(uj)> f(ui) forj:=⌊i− 21 ⌋, swapuianduj, and reseti:=j. The final 2-heap is as
required.
Clearly, these operations give 2-heaps as required, and canbe performed in time
O(log|U|).

```
This gives the result of Johnson [1977]:
```
Corollary 1.6a. Given a directed graphD= (V, A),s, t∈V and a length function
l:A→Q+, a shortests−tpath can be found in timeO(|A|log|V|).

Proof.Since the number of times a minimizing vertexuis deleted and the number
of times a valuef(u) is decreased is at most|A|, the theorem follows from Theorem
1.6.

Dijkstra’s algorithm has running timeO(|V|^2 ), while Johnson’s heap implemen-
tation gives a running time ofO(|A|log|V|). So one is not uniformly better than the
other.
If one inserts a ‘Fibonacci heap’ in Dijkstra’s algorithm, one gets a shortest path
algorithm with running time O(|A|+|V|log|V|), as was shown by Fredman and
Tarjan [1984].
AFibonacci forestis a rooted forest (V, A), so that for eachv∈V the children of
vcan be ordered in such a way that theith child has at leasti−2 children. Then:^5

Theorem 1.7. In a Fibonacci forest(V, A), each vertex has at most1 + 2 log|V|
children.

Proof.For anyv∈V, letσ(v) be the number of vertices reachable fromv. We show
thatσ(v)≥ 2 (d
out(v)−1)/ 2
, which implies the theorem.^6

(^5) dout(v) anddin(v) denote the outdegree and indegree ofv.
(^6) In fact,σ(v)≥F(dout(v)), whereF(k) is thekth Fibonacci number, thus explaining the name
Fibonacci forest.


```
Section 1.2. Speeding up Dijkstra’s algorithm with heaps 11
```
```
Letk:=dout(v) and letvibe theith child ofv(fori= 1,... , k). By induction,
σ(vi)≥ 2 (d
out(vi)−1)/ 2
≥ 2 (i−3)/^2 , asdout(vi)≥i−2. Henceσ(v) = 1 +
```
```
∑k
i=1σ(vi)≥
1 +
```
```
∑k
i=1^2
```
(i−3)/ (^2) = 2(k−1)/ (^2) + 2(k−2)/ (^2) +^1
2 −
1
2

###### √

```
2 ≥ 2 (k−1)/^2.
```
```
Now aFibonacci heapconsists of a Fibonacci forest (U, F), where for eachv∈U
the children ofvare ordered so that theith child has at leasti−2 children, and a
subsetT ofUwith the following properties:
```
(9) (i) if (u, v)∈Fthenf(u)≤f(v);
(ii) ifvis theith child ofuandv6∈Tthenvhas at leasti−1 children;
(iii) ifuandvare two distinct roots, thendout(u) 6 =dout(v).

```
So by Theorem 1.7, (9)(iii) implies that there exist at most 2+ 2 log|U|roots.
The Fibonacci heap will be described by the following data structure:
```
(10) (i) for eachu∈U, a doubly linked listCuof children ofu(in order);
(ii) a functionp :U → U, wherep(u) is the parent ofuif it has one, and
p(u) =uotherwise;
(iii) the functiondout:U→Z+;
(iv) a functionb:{ 0 ,... , t}→U(witht:= 1+⌊2 log|V|⌋) such thatb(dout(u)) =
ufor each rootu;
(v) a functionl:U→{ 0 , 1 }such thatl(u) = 1 if and only ifu∈T.

```
Theorem 1.8. When finding and deletingntimes auminimizingf(u)and decreas-
ingmtimes the valuef(u), the structure can be updated in timeO(m+p+nlogp),
wherepis the number of vertices in the initial forest.
```
```
Proof.Indeed, auminimizingf(u) can be identified in timeO(logp), since we can
scanf(b(i)) fori= 0,... , t. It can be deleted as follows. Letv 1 ,... , vkbe the children
ofu. First deleteuand all arcs leavingufrom the forest. In this way,v 1 ,... , vkhave
become roots, of a Fibonacci forest, and conditions (9)(i) and (ii) are maintained. To
repair condition (9)(iii), do for eachr=v 1 ,... , vkthe following:
```
```
(11) repair(r):
ifdout(s) =dout(r) for some roots 6 =r, then:
{iff(s)≤f(r), addsas last child ofrand repair(r);
otherwise, addras last child ofsand repair(s)}.
```
```
Note that conditions (9)(i) and (ii) are maintained, and thatthe existence of a root
s 6 =rwithdout(s) =dout(r) can be checked with the functionsb,dout, andp. (During
the process we update the data structure.)
```

12 Chapter 1. Shortest paths and trees

```
If we decrease the valuef(u) for someu∈Uwe apply the following tou:
```
(12) make root(u):
ifuhas a parent,vsay, then:
{delete arc (v, u) and repair(u);
ifv6∈T, addvtoT; otherwise, removevfromTand make root(v)}.

Now denote by incr(..) and decr(..) the number of times we increase and decrease
.. , respectively. Then:

(13) number of calls of make root = decr(f(u)) + decr(T)
≤decr(f(u)) + incr(T) +p≤2decr(f(u)) +p= 2m+p,

since we increaseT at most once after we have decreased somef(u).
This also gives, whereRdenotes the set of roots:

(14) number of calls of repair= decr(F) + decr(R)
≤decr(F) + incr(R) +p= 2decr(F) +p
≤2(nlogp+number of calls of make root)+p≤2(nlogp+ 2m+p) +p.

Since deciding calling make root or repair takes timeO(1) (by the data structure),
we have that the algorithm takes timeO(m+p+nlogp).

```
As a consequence one has:
```
Corollary 1.8a. Given a directed graphD= (V, A),s, t∈V and a length function
l:A→Q+, a shortests−tpath can be found in timeO(|A|+|V|log|V|).

Proof.Directly from the description of the algorithm.

### 1.3. Shortest paths with arbitrary lengths

If lengths of arcs may take negative values, it is not always the case that a shortest
walk exists. If the graph has a directed circuit of negative length, then we can obtain
s−twalks of arbitrarily small negative length (for appropriatesandt).
However, it can be shown that if there are no directed circuitsof negative length,
then for each choice ofsandtthere exists a shortests−twalk (if there exists at
least ones−tpath).

Theorem 1.9.Let each directed circuit have nonnegative length. Then foreach pair
s, tof vertices for which there exists at least ones−twalk, there exists a shortest


```
Section 1.3. Shortest paths with arbitrary lengths 13
```
```
s−twalk, which is a path.
```
```
Proof.Clearly, if there exists ans−twalk, there exists ans−tpath. Hence there
exists also a shortest pathP, that is, ans−tpath that has minimum lengthamong
alls−tpaths. This follows from the fact that there exist only finitely many paths.
We show thatPis shortest amongalls−twalks. LetPhave lengthL. Suppose
that there exists an s−twalk Qof length less than L. Choose such aQ with a
minimum number of arcs. SinceQis not a path (as it has length less thanL),Q
contains a directed circuitC. LetQ′be the walk obtained fromQby removingC.
Asl(C)≥0,l(Q′) =l(Q)−l(C)≤l(Q)< L. SoQ′is anothers−twalk of length
less thanL, however with a smaller number of arcs than Q. This contradicts the
assumption thatQhas a minimum number of arcs.
```
```
Also in this case there is an easy algorithm, theBellman-Ford method(Bellman
[1958], Ford [1956]), determining a shortests−tpath.
Letn:=|V|. The algorithm calculates functionsf 0 , f 1 , f 2 ,... , fn:V →R∪{∞}
successively by the following rule:
```
(15) (i) Putf 0 (s) := 0 andf 0 (v) :=∞for allv∈V\{s}.
(ii) Fork < n, iffkhas been found, put

```
fk+1(v) := min{fk(v), min
(u,v)∈A
```
```
(fk(u) +l(u, v))}
```
```
for allv∈V.
```
```
Then, assuming that there is no directed circuit of negativelength,fn(v) is equal to
the length of a shortests−vwalk, for eachv∈V. (If there is nos−vpath at all,
fn(v) =∞.)
This follows directly from the following theorem:
```
```
Theorem 1.10.For eachk= 0,... , nand for eachv∈V,
```
```
(16) fk(v) = min{l(P)|Pis ans−vwalk traversing at mostkarcs}.
```
```
Proof.By induction onkfrom (15).
```
```
So the above method gives us the length of a shortests−tpath. It is not difficult
to derive a method finding an explicit shortests−tpath. To this end, determine
parallel to the functionsf 0 ,... , fn, a functiong:V →V by settingg(v) =uwhen
we setfk+1(v) :=fk(u) +l(u, v) in (15)(ii). At termination, for anyv, the sequence
v,g(v),g(g(v)),... , sgives the reverse of a shortests−vpath. Therefore:
```

14 Chapter 1. Shortest paths and trees

Corollary 1.10a.Given a directed graphD= (V, A),s, t∈V and a length function
l:A→Q, such thatDhas no negative-length directed circuit, a shortests−tpath
can be found in timeO(|V||A|).

Proof.Directly from the description of the algorithm.

Application 1.3: Knapsack problem. Suppose we have a knapsack with a volume of
8 liter and a number of articles 1, 2 , 3 , 4 ,5. Each of the articles has a certain volume and a
certain value:

(17) article volume value
1 5 4
2 3 7
3 2 3
4 2 5
5 1 4

So we cannot take all articles in the knapsack and we have to make a selection. We want
to do this so that the total value of articles taken into the knapsack is as large as possible.

```
We can describe this problem as one of findingx 1 ,x 2 ,x 3 ,x 4 ,x 5 such that:
```
(18) x 1 ,x 2 ,x 3 ,x 4 ,x 5 ∈{ 0 , 1 },
5 x 1 + 3x 2 + 2x 3 + 2x 4 +x 5 ≤8,
4 x 1 + 7x 2 + 3x 3 + 5x 4 + 4x 5 is as large as possible.

We can solve this problem with the shortest path method as follows. Make a directed graph
in the following way (cf. Figure 1.2):

There are vertices (i,x) for 0≤i≤6 and 0≤x≤8 and there is an arc from (i− 1 ,x)
to (i,y) ify=xory=x+ai(whereaiis the volume of articlei) ifi≤5 and there are
arcs from each (5,x) to (6,8). We have deleted in the picture all vertices and arcs that do
not belong to any directed path from (0,0).

The length of arc ((i− 1 ,x),(i,y)) is equal to 0 ify=xand to−ciify=x+ai(where
cidenotes the value ofi). Moreover, all arcs ending at (6,8) have length 0.

```
Now a shortest path from (0,0) to (6,8) gives us the optimal selection.
```
Application 1.4: PERT-CPM. For building a house certain activities have to be ex-
ecuted. Certain activities have to be done before other and every activity takes a certain
number of days:


## (19) activity days needed to be done before

- 1. Shortest paths and trees
   - 1.1. Shortest paths with nonnegative lengths
   - 1.2. Speeding up Dijkstra’s algorithm with heaps
   - 1.3. Shortest paths with arbitrary lengths
   - 1.4. Minimum spanning trees
- 2. Polytopes, polyhedra, Farkas’ lemma, and linear programming
   - 2.1. Convex sets
   - 2.2. Polytopes and polyhedra
   - 2.3. Farkas’ lemma
   - 2.4. Linear programming
- 3. Matchings and covers in bipartite graphs
   - 3.1. Matchings, covers, and Gallai’s theorem
   - 3.2. M-augmenting paths
   - 3.3. K ̋onig’s theorems
   - 3.4. Cardinality bipartite matching algorithm
   - 3.5. Weighted bipartite matching
   - 3.6. The matching polytope
- 4. Menger’s theorem, flows, and circulations
   - 4.1. Menger’s theorem
   - 4.2. Flows in networks
   - 4.3. Finding a maximum flow
   - 4.4. Speeding up the maximum flow algorithm
   - 4.5. Circulations
   - 4.6. Minimum-cost flows
- 5. Nonbipartite matching
   - 5.1. Tutte’s 1-factor theorem and the Tutte-Berge formula
   - 5.2. Cardinality matching algorithm
   - 5.3. Weighted matching algorithm
   - 5.4. The matching polytope
         - 5.5. The Cunningham-Marsh formula
   - 6. Problems, algorithms, and running time
         - 6.1. Introduction
         - 6.2. Words
         - 6.3. Problems
         - 6.4. Algorithms and running time
         - 6.5. The class NP
         - 6.6. The class co-NP
         - 6.7. NP-completeness
         - 6.8. NP-completeness of the satisfiability problem
         - 6.9. NP-completeness of some other problems
      - 6.10. Turing machines
   - 7. Cliques, stable sets, and colourings
         - 7.1. Introduction
         - 7.2. Edge-colourings of bipartite graphs
         - 7.3. Partially ordered sets
         - 7.4. Perfect graphs
         - 7.5. Chordal graphs
   - 8. Integer linear programming and totally unimodular matrices
         - 8.1. Integer linear programming
         - 8.2. Totally unimodular matrices
         - 8.3. Totally unimodular matrices from bipartite graphs
         - 8.4. Totally unimodular matrices from directed graphs
   - 9. Multicommodity flows and disjoint paths
         - 9.1. Introduction
         - 9.2. Two commodities
         - 9.3. Disjoint paths in acyclic directed graphs
         - 9.4. Vertex-disjoint paths in planar graphs
         - 9.5. Edge-disjoint paths in planar graphs
         - 9.6. A column generation technique for multicommodity flows
- 10. Matroids
- 10.1. Matroids and the greedy algorithm
- 10.2. Equivalent axioms for matroids
- 10.3. Examples of matroids
- 10.4. Two technical lemmas
- 10.5. Matroid intersection
- 10.6. Weighted matroid intersection
- 10.7. Matroids and polyhedra
   - References
   - Name index
   - Subject index
- Section 1.3. Shortest paths with arbitrary lengths
         - -
                           -
                                          -
                                                         -
            -
                                                         -
                                                                           -
                                                                           -
                                                                  -
                                                                     -
                                                                     -
                                                                     -
                                                                     -
                                                                        -
                     - -
                        - -
                                    - -
                              - -
                                 - -
                                                      - -
                                                   - -
                                                - -
                                                   - -
                                                               - -
                                                               - -
                                                               - -
                                                               - -
                                                               - -
                                       -
      -
   -
   -
   -
   -
   -
   -
   -
   -
   -
                                                            -
                                                               - -
                                             - Figure 1.
                  - 1. groundwork activity #
                  - 2. foundation
                  - 3. building walls 10 4,6,
                  - 4. exterior plumbing 4 5,
                  - 5. interior plumbing
                  - 6. electricity
                  - 7. roof
                  - 8. finishing off outer walls
                  - 9. exterior painting
               - 10. panelling 8 11,
               - 11. floors
               - 12. interior painting
               - 13. finishing off interior
               - 14. finishing off exterior


16 Chapter 1. Shortest paths and trees

We introduce two dummy activities 0 (start) and 15 (completion), each taking 0 days, where
activity 0 has to be performed before all other activities and 15 after all other activities.
The project can be represented by a directed graphDwith vertices 0, 1 ,..., 14 ,15,
where there is an arc fromitojifihas to be performed beforej. The length of arc (i,j)
will be the numbertiof days needed to perform activityi. This graph with length function
is called theproject network.

```
2 4
```
```
10
10
```
```
10
```
```
4
4
```
```
5
```
```
7
```
```
7 9
```
(^846)
2
1 2 3
4
6
7 8 9
5
10
14
11
12
13
15
8 5
6
0
0
Figure 1.
Now alongestpath from 0 to 15 gives the minimum number of days needed to build the
house. Indeed, iflidenotes the length of a longest path from 0 toi, we can start activityi
on dayli. If activityjhas been done after activityi, thenlj≥li+tiby definition of longest
path. So there is sufficient time for completing activityiand the schedule is practically
feasible. That is, there is the following min-max relation:
(20) the minimum number of days needed to finish the project isequal to the maxi-
mum length of a path in the project network.
A longest path can be found with the Bellman-Ford method, as it is equivalent to a
shortest path when we replace each length by its opposite. Note thatDshould not have
any directed circuits since otherwise the whole project would be infeasible.
So the project network helps in planning the project and is the basis of the so-called
‘Program Evaluation and Review Technique’ (PERT). (Actually, one often represents ac-
tivities by arcs instead of vertices, giving a more complicated way of defining the graph.)
Any longest path from 0 to 15 gives the minimum number of days needed to complete
the project. Such a path is called acritical pathand gives us the bottlenecks in the project.
It tells us which activities should be controlled carefullyin order to meet a deadline. At
least one of these activities should be sped up if we wish to complete the project faster.
This is the basis of the ‘Critical Path Method’ (CPM).
Application 1.5: Price equilibrium.A small example of an economical application is
as follows. Consider a number of remote villages, sayB,C,D,EandF. Certain pairs of
villages are connected by routes (like in Figure 1.4).
If villagesXandY are connected by a route, letkX,Y be the cost of transporting one
liter of oil fromXtoY.


Section 1.3. Shortest paths with arbitrary lengths 17

```
B
```
```
C D
```
```
E F
Figure 1.
```
At a certain day, one detects an oil well in villageB, and it makes oil freely available
in villageB. Now one can follow how the oil price will develop, assuming that no other oil
than that from the well inBis available and that only once a week there is contact between
adjacent villages.
It will turn out that the oil prices in the different villages will follow the iterations in
the Bellman-Ford algorithm. Indeed in week 0 (the week in which the well was detected)
the price inBequals 0, while in all other villages the price is∞, since there is simply no
oil available yet.
In week 1, the price inBequals 0, the price in any villageY adjacent toBis equal to
kB,Y per liter and in all other villages it is still∞.

In weeki+ 1 the liter pricepi+1,Y in any villageY is equal to the minimum value of
pi,Y and allpi,X+kX,Y for which there is a connection fromXtoY.

```
There will be price equilibrium if for each villageY one has:
```
(21) it is not cheaper for the inhabitants ofY to go to an adjacent villageXand to
transport the oil fromXtoY.

Moreover, one has the min-max relation for each villageY:

(22) the maximum liter price in villageY is equal to the the minimum length of a
path in the graph fromBtoY

takingkX,Y as length function.
A comparable, but less spatial example is: the vertices of the graph represent oil prod-
ucts (instead of villages) andkX,Y denotes the cost per unit of transforming oil productX
to oil productY. If oil productBis free, one can determine the costs of the other products
in the same way as above.

Exercises

```
1.2. Find with the Bellman-Ford method shortest paths fromsto each of the other vertices
in the following graphs (where the numbers at the arcs give the length):
```

18 Chapter 1. Shortest paths and trees

```
(i)
```
```
3
```
```
−
```
```
1
```
```
4
```
```
−1 −
```
```
3
```
```
7 2
```
```
1
```
```
2 −
```
```
s
```
```
(ii)
```
```
2 1 −2 −4 7 −
```
```
1 1
```
```
3 −3 4
```
```
7 4 3 −8 3 2
```
```
2 −
```
```
s
```
```
1.3. Let be given the distance table:
```
```
to: A B C D E F G
from: A 0 1 ∞ ∞ ∞ 2 12
B ∞ 0 ∞ ∞ ∞ ∞ ∞
C ∞ −15 0 4 8 ∞ ∞
D ∞ ∞ 4 0 ∞ ∞ − 2
E ∞ ∞ ∞ 4 0 ∞ ∞
F ∞ ∞ ∞ 9 3 0 12
G ∞ −12 2 3 − 1 −4 0
```
```
A distance∞fromXtoY should be interpreted as no direct route existing fromX
toY.
Determine with the Bellman-Ford method the distance fromAto each of the other
cities.
```
```
1.4. Solve the knapsack problem of Application 1.3 with the Bellman-Ford method.
```
```
1.5. Describe an algorithm that tests if a given directed graph with length function con-
tains a directed circuit of negative length.
```

Section 1.4. Minimum spanning trees 19

```
1.6. LetD= (V,A) be a directed graph and letsandtbe vertices ofD, such thattis
reachable froms. Show that the minimum number of arcs in ans−tpath is equal
to the maximum value ofφ(t)−φ(s), whereφranges over all functionsφ:V →Z
such thatφ(w)−φ(v)≤1 for each arc (v,w).
```
### 1.4. Minimum spanning trees

LetG= (V, E) be a connected undirected graph and letl:E→Rbe a function,
called thelengthfunction. For any subsetFofE, thelengthl(F) ofFis, by definition:

(23) l(F) :=

###### ∑

```
e∈F
```
```
l(e).
```
In this section we consider the problem of finding a spanning tree inGof minimum
length. There is an easy algorithm for finding a minimum-length spanning tree,
essentially due to Bor ̊uvka [1926]. There are a few variants. The first one we discuss
is sometimes called theDijkstra-Prim method(after Prim [1957] and Dijkstra [1959]).

Choose a vertex v 1 ∈ V arbitrarily. Determine edgese 1 , e 2... successively as
follows. LetU 1 :={v 1 }. Suppose that, for somek≥0, edgese 1 ,... , ek have been
chosen, forming a spanning tree on the setUk. Choose an edgeek+1∈δ(Uk) that has
minimum length among all edges inδ(Uk).^7 LetUk+1:=Uk∪ek+1.
By the connectedness ofGwe know that we can continue choosing such an edge
untilUk=V. In that case the selected edges form a spanning treeTinG. This tree
has minimum length, which can be seen as follows.
Call a forestFgreedyif there exists a minimum-length spanning treeTofGthat
containsF.

Theorem 1.11. LetF be a greedy forest, letU be one of its components, and let
e∈δ(U). Ifehas minimum length among all edges inδ(U), thenF∪{e}is again a
greedy forest.

Proof.LetTbe a minimum-length spanning tree containingF. LetPbe the unique
path in T between the end vertices ofe. Then P contains at least one edgef
that belongs to δ(U). So T′ := (T\{f})∪{e} is a tree again. By assumption,
l(e)≤l(f) and hencel(T′)≤l(T). Therefore,T′is a minimum-length spanning tree.
AsF∪{e}⊆T′, it follows thatF∪{e}is greedy.

Corollary 1.11a. The Dijkstra-Prim method yields a spanning tree of minimum
length.

(^7) δ(U) is the set of edgesesatisfying|e∩U|= 1.


20 Chapter 1. Shortest paths and trees

Proof.It follows inductively with Theorem 1.11 that at each stage of the algorithm
we have a greedy forest. Hence the final tree is greedy — equivalently, it has minimum
length.

```
In fact one may show:
```
Theorem 1.12.Implementing the Dijkstra-Prim method using Fibonacci heaps gives
a running time ofO(|E|+|V|log|V|).

Proof.The Dijkstra-Prim method is similar to Dijkstra’s method for finding a short-
est path. Throughout the algorithm, we store at each vertexv∈V\Uk, the length
f(v) of a shortest edge{u, v}withu∈Uk, organized as a Fibonacci heap. A vertex
uk+1to be added toUkto formUk+1should be identified and removed from the Fi-
bonacci heap. Moreover, for each edgeeconnectinguk+1and somev∈V\Uk+1, we
should updatef(v) if the length ofuk+1vis smaller thanf(v).

Thus we find and delete≤|V|times auminimizingf(u) and we decrease≤|E|
times a valuef(v). Hence by Theorem 1.8 the algorithm can be performed in time
O(|E|+|V|log|V|).

The Dijkstra-Prim method is an example of a so-calledgreedyalgorithm. We
construct a spanning tree by throughout choosing an edge that seems the best at the
moment. Finally we get a minimum-length spanning tree. Oncean edge has been
chosen, we never have to replace it by another edge (no ‘back-tracking’).

There is a slightly different method of finding a minimum-length spanning tree,
Kruskal’smethod (Kruskal [1956]). It is again a greedy algorithm, andagain itera-
tively edgese 1 , e 2 ,.. .are chosen, but by some different rule.

Suppose that, for somek≥0, edgese 1 ,... , ekhave been chosen. Choose an edge
ek+1such that{e 1 ,... , ek, ek+1}forms a forest, withl(ek+1) as small as possible. By
the connectedness ofGwe can (starting withk= 0) iterate this until the selected
edges form a spanning tree ofG.

Corollary 1.12a.Kruskal’s method yields a spanning tree of minimum length.

Proof.Again directly from Theorem 1.11.

```
In a similar way one finds amaximum-length spanning tree.
```
Application 1.6: Minimum connections.There are several obvious practical situations
where finding a minimum-length spanning tree is important, for instance, when designing a
road system, electrical power lines, telephone lines, pipelines, wire connections on a chip.
Also when clustering data say in taxonomy, archeology, or zoology, finding a minimum
spanning tree can be helpful.


Section 1.4. Minimum spanning trees 21

Application 1.7: The maximum reliability problem. Often in designing a network
one is not primarily interested in minimizing length, but rather in maximizing ‘reliability’
(for instance when designing energy or communication networks). Certain cases of this
problem can be seen as finding amaximumlength spanning tree, as was observed by Hu
[1961]. We give a mathematical description.

LetG= (V,E) be a graph and lets:E→R+be a function. Let us calls(e) the
strengthof edgee. For any pathPinG, thereliabilityofPis, by definition, the minimum
strength of the edges occurring inP. ThereliabilityrG(u,v) of two verticesuandvis equal
to the maximum reliability ofP, wherePranges over all paths fromutov.

```
LetTbe a spanning tree of maximum strength, i.e., with
```
∑
e∈ETs(e) as large as possible.
(HereETis the set of edges ofT.) SoT can be found with any maximum spanning tree
algorithm.

```
NowThas the same reliability asG, for each pair of verticesu,v. That is:
```
(24) rT(u,v) =rG(u,v) for eachu,v∈V.

We leave the proof as an exercise (Exercise 1.11).

Exercises

```
1.7. Find, both with the Dijkstra-Prim algorithm and with Kruskal’s algorithm, a span-
ning tree of minimum length in the graph in Figure 1.5.
```
```
3 2
```
```
2 4 1
```
```
5 3
```
```
3 6 3
```
```
5 4 4 6 2 3
```
```
4 3 5 7 4 2
```
```
Figure 1.5
```
```
1.8. Find a spanning tree of minimum length between the cities given in the following
distance table:
```

```
22 Chapter 1. Shortest paths and trees
```
Ame Ams Ape Arn Ass BoZ Bre Ein Ens s-G Gro Haa DH s-H Hil Lee Maa Mid Nij Roe Rot Utr Win Zut Zwo
Amersfoort 0 47 47 46 139 123 86 111 114 81 164 67 126 73 18 147 190 176 63 141 78 20 109 65 70
Amsterdam 47 0 89 92 162 134 100 125 156 57 184 20 79 87 30 132 207 175 109 168 77 40 151 107 103
Apeldoorn 47 89 0 25 108 167 130 103 71 128 133 109 154 88 65 129 176 222 42 127125 67 66 22 41
Arnhem 46 92 25 0 132 145 108 78 85 116 157 112 171 63 64 154 151 200 17 102 113 59 64 31 66
Assen 139 162 108 132 0 262 225 210 110 214 25 182 149 195 156 68 283 315 149 234 217 159 143 108 69
Bergen op Zoom 123 134 167 145 262 0 37 94 230 83 287 124 197 82 119 265 183 59 128 144 57 103 209 176 193
Breda 86 100 130 108 225 37 0 57 193 75 250 111 179 45 82 228 147 96 91 107 49 66 172 139 156
Eindhoven 111 125 103 78 210 94 57 0 163 127 235 141 204 38 107 232 100 153 61 50 101 91 142 109 144
Enschede 114 156 71 85 110 230 193 163 0 195 135 176 215 148 132 155 236 285 102 187 192 134 40 54 71
’s-Gravenhage 81 57 128 116 214 83 75 127 195 0 236 41 114 104 72 182 162 124 133 177 26 61 180 146 151
Groningen 164 184 133 157 25 287 250 235 135 236 0 199 147 220 178 58 308 340 174 259 242 184 168 133 94
Haarlem 67 20 109 112 182 124 111 141 176 41 199 0 73 103 49 141 203 165 129 184 67 56 171 127 123
Den Helder 126 79 154 171 149 197 179 204 215 114 147 73 0 166 109 89 276 238 188 247 140 119 220 176 144
’s-Hertogenbosch 73 87 88 63 195 82 45 38 148 104 220 103 166 0 69 215 123 141 46 81 79 53 127 94 129
Hilversum 18 30 65 64 156 119 82 107 132 72 178 49 109 69 0 146 192 172 81 150 74 16 127 83 88
Leeuwarden 147 132 129 154 68 265 228 232 155 182 58 141 89 215 146 0 306 306 171 256 208 162 183 139 91
Maastricht 190 207 176 151 283 183 147 100 236 162 308 203 276 123 192 305 0 242 135 50 188 176 213 182 217
Middelburg 176 175 222 200 315 59 96 153 285 124 340 165 238 141 172 306 242 0 187 203 98 156 264 231 246
Nijmegen 63 109 42 17 149 128 91 61 102 133 174 129 188 46 81 171 135 187 0 85 111 76 81 48 83
Roermond 141 168 127 102 234 144 107 50 187 177 259 184 247 81 150 256 50 203 85 0 151 134 166 133 168
Rotterdam 78 77 125 113 217 57 49 101 192 26 242 67 140 79 74 208 188 98 111 151 0 58 177 143 148
Utrecht 20 40 67 59 159 103 66 91 134 61 184 56 119 53 16 162 176 156 76 134 58 0 123 85 90
Winterswijk 109 151 66 64 143 209 172 142 40 180 168 171 220 127 127 183 213 264 81 166 177 123 0 44 92
Zutphen 65 107 22 31 108 176 139 109 54 146 133 127 176 94 83 139 182 231 48 133 143 85 44 0 48
Zwolle 70 103 41 66 69 193 156 144 71 151 94 123 144 129 88 91 217 246 83 168148 90 92 48 0

```
1.9. LetG= (V,E) be a graph and letl:E→Rbe a ‘length’ function. Call a forestF
goodifl(F′)≥l(F) for each forestF′satisfying|F′|=|F|.
LetFbe a good forest andebe an edge not inFsuch thatF∪{e}is a forest and
such that (among all suche)l(e) is as small as possible. Show thatF∪{e}is good
again.
```
```
1.10. LetG= (V,E) be a complete graph and letl:E→R+be a length function satisfying
l(uw)≥min{l(uv),l(vw)}for all distinctu,v,w∈V. LetT be a longest spanning
tree inG.
Show that for allu,w∈V,l(uw) is equal to the minimum length of the edges in the
uniqueu−wpath inT.
```
```
1.11. Prove (24).
```

###### 23

## 2. Polytopes, polyhedra, Farkas’ lemma, and linear programming

### 2.1. Convex sets

```
A subsetCofRnis calledconvexif for allx, yinCand any 0≤λ≤1 alsoλx+(1−λ)y
belongs toC. SoC is convex if with any two points inC, the whole line segment
connectingxandybelongs toC.
Clearly, the intersection of any number of convex sets is again a convex set. So,
for any subsetXofRn, the smallest convex set containingXexists. This set is called
theconvex hullofXand is denoted by conv.hull(X). One easily proves:
```
```
(1) conv.hull(X) ={x|∃t∈N,∃x 1 ,... , xt∈X,∃λ 1 ,... , λt≥0 :
x=λ 1 x 1 +···+λtxt, λ 1 +···+λt= 1}.
```
```
A basic property of closed convex sets is that any point not inCcan be separated
fromCby a ‘hyperplane’. Here a subsetHofRnis called ahyperplane(or anaffine
hyperplane) if there exist a vectorc∈Rnwithc 6 = 0 and aδ∈Rsuch that:
```
```
(2) H={x∈Rn|cTx=δ}.
```
```
We say thatHseparateszandCifzandCare in different components ofRn\H.
```
```
Theorem 2.1. LetC be a closed convex set inRnand letz6∈C. Then there exists
a hyperplane separatingz andC.
```
```
Proof.Since the theorem is trivial ifC=∅, we assumeC 6 =∅. Then there exists a
vectoryinCthat is nearest toz, i.e., that minimizes‖z−y‖.
(The fact that such ayexists, can be seen as follows. SinceC 6 =∅, there exists
anr >0 such thatB(z, r)∩C 6 =∅. HereB(z, r) denotes the closed ball with center
zand radiusr. Thenyminimizes the continuous function‖z−y‖over the compact
setB(z, r)∩C.)
Now define:
```
```
(3) c:=z−y, δ:=
```
###### 1

###### 2

```
(‖z‖^2 −‖y‖^2 ).
```
```
We show
```
(4) (i)cTz > δ,
(ii)cTx < δfor eachx∈C.


24 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

Indeed,cTz= (z−y)Tz >(z−y)Tz−^12 ‖z−y‖^2 =δ. This shows (4)(i).
If (4)(ii) would not hold, there exists anxinCsuch thatcTx≥δ. SincecTy <
cTy+^12 ‖c‖^2 =δ, we knowcT(x−y)>0. Hence there exists aλwith 0< λ≤1 and

(5) λ <

```
2 cT(x−y)
‖x−y‖^2
```
###### .

Define

(6) w:=λx+ (1−λ)y.

Sowbelongs toC. Moreover,

(7) ‖w−z‖^2 =‖λ(x−y) + (y−z)‖^2 =‖λ(x−y)−c‖^2
=λ^2 ‖x−y‖^2 − 2 λcT(x−y) +‖c‖^2 <‖c‖^2 =‖y−z‖^2.

Here<follows from (5).
However, (7) contradicts the fact thatyis a point inC nearest toz.

Theorem 2.1 implies a characterization of closed convex sets – see Exercise 2.1.
Call a subsetHofRnahalfspace(or anaffine halfspace) if there exist a vectorc∈Rn
withc 6 = 0 and aδ∈Rsuch that

(8) H={x∈Rn|cTx≤δ}.

Clearly, each affine halfspace is a closed convex set.
Theorem 2.1 implies that ifCis a closed convex set andz6∈C, then there exists
an affine halfspaceHso thatC⊆Handz6∈H.

Exercises

```
2.1. LetC⊆Rn. ThenCis a closed convex set if and only ifC=
```
```
⋂
Ffor some collection
Fof affine halfspaces.
```
```
2.2. LetC ⊆ Rnbe a convex set and letAbe anm×nmatrix. Show that the set
{Ax|x∈C}is again convex.
```
```
2.3. LetXbe a finite set of vectors inRn. Show that conv.hull(X) is compact.
(Hint:Show that conv.hull(X) is the image under a continuous function of a compact
set.)
```
```
2.4. Show that ifz∈conv.hull(X), then there exist affinely independent vectorsx 1 ,...,xm
inXsuch thatz∈conv.hull{x 1 ,...,xm}. (This is the affine form of ‘Carath ́eodory’s
theorem’ (Carath ́eodory [1911]).)
```

Section 2.2. Polytopes and polyhedra 25

```
(Vectorsx 1 ,...,xm are calledaffinely independentif there are no realsλ 1 ,...,λm,
such thatλ 1 x 1 +···+λmxm= 0 andλ 1 +···+λm= 0 and such thatλ 1 ,...,λmare
not all equal to 0.)
```
```
2.5. (i) LetCandDbe two nonempty, bounded, closed, convex subsets ofRnsuch that
C∩D=∅. Derive from Theorem 2.1 that there exists an affine hyperplaneH
separatingCandD. (This means thatCandDare in different components of
Rn\H.)
(Hint:Consider the setC−D:={x−y|x∈C,y∈D}.)
(ii) Show that in (i) we cannot delete the boundedness condition.
```
### 2.2. Polytopes and polyhedra

Special classes of closed convex sets are formed by the polytopes and the polyhedra.
In the previous section we saw that each closed convex set is the intersection of affine
halfspaces, possibly infinitely many. If it is the intersection of afinitenumber of affine
halfspaces, the convex set is called apolyhedron.
So a subsetPofRnis a polyhedron if and only if there exists anm×nmatrixA
and a vectorb∈Rmsuch that

(9) P={x∈Rn|Ax≤b}.

HereAx≤bmeans:

(10) a 1 x≤b 1 ,... , amx≤bm,

wherea 1 ,... , amare the rows ofA.

The matrixAmay have zero rows, i.e.m= 0. In that case,P=Rn.
Related is the notion of ‘polytope’. A subsetPofRnis called apolytopeifPis
the convex hull of a finite number of vectors. That is, there exist vectorsx 1 ,... , xt
inRnsuch that

(11) P= conv.hull{x 1 ,... , xt}.

We will show that a subsetPofRnis a polytope if and only if it is a bounded
polyhedron. This might be intuitively clear, but a strictlymathematical proof requires
some work.
We first give a definition. LetP be a convex set. A pointz ∈P is called a
vertexofPifzisnota convex combination of two other points inP. That is, there
do not exist pointsx, yinP and aλwith 0< λ < 1 such thatx 6 =z, y 6 =zand
z=λx+ (1−λ)y.


26 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

To characterize vertices we introduce the following notation. LetP={x|Ax≤
b}be a polyhedron and letz∈P. ThenAzis the submatrix ofAconsisting of those
rowsaiofAfor whichaiz=bi.
Then we can show:

Theorem 2.2. LetP={x|Ax≤b}be a polyhedron inRnand letz∈P. Thenz
is a vertex ofPif and only ifrank(Az) =n.

Proof.Necessity. Letz be a vertex ofP and suppose rank(Az)< n. Then there
exists a vectorc 6 = 0 such thatAzc= 0. Sinceaiz < bifor everyaithat does not
occur inAz, there exists aδ >0 such that:

(12) ai(z+δc)≤biandai(z−δc)≤bi

for every rowaiofAnot occurring inAz. SinceAzc= 0 andAz≤bit follows that

(13) A(z+δc)≤bandA(z−δc)≤b.

Soz+δcandz−δcbelong toP. Sincezis a convex combination of these two vectors,
this contradicts the fact thatzis a vertex ofP.

Sufficiency.Suppose rank(Az) =nwhilezis not a vertex ofP. Then there exist
pointsxandyinPsuch thatx 6 =z 6 =yandz=^12 (x+y). Then for every rowaiof
Az:

(14) aix≤bi=aiz =⇒ ai(x−z)≤0, and
aiy≤bi=aiz =⇒ ai(y−z)≤0.

Sincey−z=−(x−z), this implies thatai(x−z) = 0. HenceAz(x−z) = 0. Since
x−z 6 = 0, this contradicts the fact that rank(Az) =n.

Theorem 2.2 implies that a polyhedron has only a finite numberof vertices: For
each two different verticesz andz′one hasAz 6 =Az′, sinceAzx=bz has only one
solution, namelyx=z(wherebzdenotes the part ofbcorresponding toAz). Since
there exist at most 2mcollections of subrows ofA,Phas at most 2mvertices.

```
From Theorem 2.2 we derive:
```
Theorem 2.3.LetP be a bounded polyhedron, with verticesx 1 ,... , xt. ThenP=
conv.hull{x 1 ,... , xt}.

Proof.Clearly

(15) conv.hull{x 1 ,... , xt}⊆P,


```
Section 2.2. Polytopes and polyhedra 27
```
```
sincex 1 ,... , xtbelong toP and sincePis convex.
The reverse inclusion amounts to:
```
```
(16) ifz∈Pthenz∈conv.hull{x 1 ,... , xt}.
```
```
We show (16) by induction onn−rank(Az).
Ifn−rank(Az) = 0, then rank(Az) =n, and hence, by Theorem 2.2,zitself is a
vertex ofP. Soz∈conv.hull{x 1 ,... , xt}.
Ifn−rank(Az)>0, then there exists a vectorc 6 = 0 such thatAzc= 0. Define
```
```
(17) μ 0 := max{μ|z+μc∈P},
ν 0 := max{ν|z−νc∈P}.
```
```
These numbers exist sincePis compact. Letx:=z+μ 0 candy:=z−ν 0 c.
Now
```
```
(18) μ 0 = min{
```
```
bi−aiz
aic
```
```
|aiis a row ofA; aic > 0 }.
```
```
This follows from the fact thatμ 0 is the largestμsuch thatai(z+μc)≤bifor each
i= 1,... , m. That is, it is the largestμsuch that
```
```
(19) μ≤
```
```
bi−aiz
aic
```
```
for everyiwithaic >0.
Let the minimum (18) be attained by i 0. So for i 0 we have equality in (18).
Therefore
```
(20) (i)Azx=Azz+μ 0 Azc=Azz,
(ii)ai 0 x=ai 0 (z+μ 0 c) =bi 0.

```
So Ax contains all rows inAz, and moreover it contains rowai 0. Now Azc = 0
whileai 0 c 6 = 0. This implies rank(Ax)>rank(Az). So by our induction hypothesis,x
belongs to conv.hull{x 1 ,... , xt}. Similarly,ybelongs to conv.hull{x 1 ,... , xt}. There-
fore, aszis a convex combination ofxandy,zbelongs to conv.hull{x 1 ,... , xt}.
```
```
As a direct consequence we have:
```
```
Corollary 2.3a. Each bounded polyhedron is a polytope.
```
```
Proof.Directly from Theorem 2.3.
```

28 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

```
Conversely:
```
Theorem 2.4.Each polytope is a bounded polyhedron.

Proof.LetPbe a polytope inRn, say

(21) P= conv.hull{x 1 ,... , xt}.

We may assume thatt≥1. We prove the theorem by induction onn. Clearly,Pis
bounded.
IfPis contained in some affine hyperplane, the theorem follows from the induction
hypothesis.
So we may assume thatPis not contained in any affine hyperplane. It implies
that the vectorsx 2 −x 1 ,... , xt−x 1 spanRn. It follows that there exist a vectorx 0
inPand a realr >0 such that the ballB(x 0 , r) is contained inP.
Without loss of generality,x 0 = 0. DefineP∗by

(22) P∗:={y∈Rn|xTy≤1 for eachx∈P}.

```
ThenP∗is a polyhedron, as
```
(23) P∗={y∈Rn|xTjy≤1 forj= 1,... , t}.

This follows from the fact that ifybelongs to the right hand set in (23) andx∈P
thenx=λ 1 x 1 +···+λtxtfor certainλ 1 ,... , λt≥0 withλ 1 +···+λt= 1, implying

(24) xTy=

```
∑t
```
```
j=1
```
```
λjxTjy≤
```
```
∑t
```
```
j=1
```
```
λj= 1.
```
Soybelongs toP∗.
Moreover,P∗is bounded, since for eachy 6 = 0 inP∗one has thatx:=r·‖y‖−^1 ·y
belongs toB(0, r) and hence toP. Therefore,xTy≤1, and hence

(25) ‖y‖= (xTy)/r≤ 1 /r.

SoP∗⊆B(0, 1 /r).
This proves thatP∗is a bounded polyhedron. By Corollary 2.3a,P∗is a polytope.
So there exist vectorsy 1 ,... , ysinRnsuch that

(26) P∗= conv.hull{y 1 ,... , ys}.

We show:


Section 2.2. Polytopes and polyhedra 29

(27) P={x∈Rn|yjTx≤1 for allj= 1,... , s}.

This implies thatPis a polyhedron.
To see the inclusion⊆ in (27), it suffices to show that each of the vectorsxi
belongs to the right hand side in (27). This follows directlyfrom the fact that for
eachj= 1,... , s,yjTxi=xTiyj≤1, sinceyjbelongs toP∗.
To see the inclusion⊇in (25), letx∈Rnbe such thatyTjx≤1 for allj= 1,... , s.
Supposex6∈P. Then there exists a hyperplane separatingxandP. That is, there
exist a vectorc 6 = 0 inRn and aδ∈Rsuch thatcTx′ < δfor eachx′ ∈P, while
cTx > δ. As 0∈P,δ >0. So we may assumeδ= 1. Hencec∈P∗. So there exist
μ 1 ,... , μs≥0 such thatc=μ 1 y 1 +···μsysandμ 1 +···+μs= 1. This gives the
contradiction:

(28) 1 < cTx=

```
∑s
```
```
j=1
```
```
μjyjTx≤
```
```
∑s
```
```
j=1
```
```
μj= 1.
```
Convex cones

Convex cones are special cases of convex sets. A subsetCofRnis called aconvex
coneif for anyx, y∈Cand anyλ, μ≥0 one hasλx+μy∈C.
For anyX⊆Rn, cone(X) is the smallest cone containingX. One easily checks:

(29) cone(X) ={λ 1 x 1 +···λtxt|x 1 ,... , xt∈X;λ 1 ,... , λt≥ 0 }.

```
A coneCis calledfinitely generatedifC= cone(X) for some finite setX.
```
Exercises

```
2.6. Determine the vertices of the following polyhedra:
```
```
(i)P={(x,y)|x≥ 0 ,y≥ 0 ,y−x≤ 2 ,x+y≤ 8 ,x+ 2y≤ 10 ,x≤ 4 }.
(ii)P = {(x,y,z) |x+y ≤ 2 ,y+z ≤ 4 ,x+z ≤ 3 ,− 2 x−y ≤ 3 ,−y− 2 z ≤
3 ,− 2 x−z≤ 2 }.
(iii)P={(x,y)|x+y≤ 1 ,x−y≤ 2 }.
(iv) P={(x,y)|x+y= 1,x≥ 3 }.
(v) P={(x,y,z)|x≥ 0 ,y≥ 0 ,x+y≤ 1 }.
(vi) P={(x,y,z)|x+y≥ 1 ,x+z≥ 1 ,y−z≥ 0 }.
(vii) P={(x,y)| 3 x+ 2y≤ 18 ,x−y≥− 6 , 5 x+ 2y≤ 20 ,x≥ 0 ,y≥ 0 }.
```
```
2.7. LetC⊆ Rn. ThenCis a closed convex cone if and only ifC =
```
```
⋂
F for some
collectionFof linear halfspaces.
```

30 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

```
(A subsetHofRnis called alinear halfspaceifH={x∈Rn|cTx≤ 0 }for some
nonzero vectorc.)
```
```
2.8. Show that ifz∈cone(X), then there exist linearly independent vectorsx 1 ,...,xm
inX such thatz∈cone{x 1 ,...,xm}. (This is the linear form of ‘Carath ́eodory’s
theorem’.)
```
```
2.9. LetAbe anm×nmatrix of rankmand letb∈Rm. Derive from Exercise 2.8 that
the systemAx=bhas a nonnegative solutionxif and only if it has a nonnegative
basic solution.
(A submatrixBofAis called abasisofAifBis a nonsingularm×msubmatrix of
A. A solutionxofAx=bis abasic solutionifAhas a basisBso thatxis 0 in those
coordinatesnotcorresponding to columns inB.)
2.10. Prove that every finitely generated convex cone is a closed set. (This can be derived
from Exercise 2.3 and Corollary 2.3a.)
```
```
2.11. Prove that a convex cone is finitely generated if and only if it is the intersection of
finitely many linear halfspaces.
(Hint:Use Corollary 2.3a and Theorem 2.4.)
2.12. LetPbe a subset ofRn. Show thatPis a polyhedron if and only ifP=Q+Cfor
some polytopeQand some finitely generated convex coneC.
```
```
(Hint:Apply Exercise 2.11 to cone(X) inRn+1, whereXis the set of vectors
```
```
(
1
x
```
```
)
```
```
inRn+1withx∈P.)
```
```
2.13. For any subsetXofRn, define
```
```
(30) X∗:={y∈Rn|xTy≤1 for eachx∈X}.
```
```
(i) Show that for each convex coneC,C∗is a closed convex cone.
(ii) Show that for each closed convex coneC, (C∗)∗=C.
```
```
2.14. LetPbe a polyhedron.
```
```
(i) Show thatP∗is again a polyhedron.
(Hint:Use previous exercises.)
(ii) Show thatP contains the origin if and only if (P∗)∗=P.
(iii) Show that the origin is an internal point ofPif and only ifP∗is bounded.
```
### 2.3. Farkas’ lemma

LetAbe anm×nmatrix and letb∈Rm. With the Gaussian elimination method
one can prove that


```
Section 2.3. Farkas’ lemma 31
```
```
(31) Ax=b
```
```
has a solutionxif and only if there is no solutionyfor the following system of linear
equations:
```
```
(32) yTA= 0, yTb=− 1.
```
```
Farkas’ lemma (Farkas [1894,1896,1898]) gives an analogous characterization for
the existence of anonnegativesolutionxfor (31).
```
```
Theorem 2.5 (Farkas’ lemma). The systemAx=bhas a nonnegative solution if
and only if there is no vectorysatisfyingyTA≥ 0 andyTb < 0.
```
```
Proof.Necessity.SupposeAx=bhas a solutionx 0 ≥0 and suppose there exists a
vectory 0 satisfyingyT 0 A≥0 andyT 0 b <0. Then we obtain the contradiction
```
```
(33) 0 > yT 0 b=y 0 T(Ax 0 ) = (y 0 TA)x 0 ≥ 0.
```
```
Sufficiency.SupposeAx=bhas no solutionx≥0. Leta 1 ,... , anbe the columns
ofA. So
```
```
(34) b6∈C:= cone{a 1 ,... , an}.
```
```
So by Exercise 2.7 there exists a linear halfspaceHcontainingCand not containing
b. That is, there exists a vectorcsuch thatcTb <0 whilecTx≥0 for eachxinC.
In particular,cTaj≥0 forj= 1,... , n. Soy:=csatisfiesyTA≥0 andyTb <0.
```
```
So Farkas’ lemma states that exactly one of the following twoassertions is true:
```
(35) (i)∃x≥0 :Ax=b,
(ii)∃y:yTA≥0 andyTb <0.

```
There exist several variants of Farkas’ lemma, that can be easily derived from
Theorem 2.5.
```
```
Corollary 2.5a. The systemAx≤bhas a solutionxif and only if there is no vector
ysatisfyingy≥ 0 , yTA= 0andyTb < 0.
```
```
Proof.LetA′be the matrix
```
```
(36) A′:= [A −A I],
```
```
whereIdenotes them×midentity matrix.
```

32 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

ThenAx≤bhas a solutionxif and only if the systemA′x′=bhas a nonnegative
solutionx′. Applying Theorem 2.5 toA′x′=bgives the corollary.

```
Another consequence is:
```
Corollary 2.5b.Suppose that the systemAx≤bhas at least one solution. Then for
every solutionxofAx≤bone hascTx≤δif and only if there exists a vectory≥ 0
such thatyTA=cT andyTb≤δ.

Proof.Sufficiency.If such a vectoryexists, then for every vectorxone has

(37) Ax≤b=⇒yTAx≤yTb=⇒cTx≤yTb=⇒cTx≤δ.

Necessity.Suppose that such a vectorydoes not exist. It means that the following
system of linear inequalities in the variablesyandλhas no solution (yT λ)≥(0 0):

(38) (yT λ)

###### (

```
A b
0 1
```
###### )

```
= (cT δ).
```
According to Farkas’ lemma this implies that there exists a vector

###### (

```
z
μ
```
###### )

```
so that
```
###### (39)

###### (

```
A b
0 1
```
###### )(

```
z
μ
```
###### )

###### ≥

###### (

###### 0

###### 0

###### )

```
and (cT δ)
```
###### (

```
z
μ
```
###### )

###### < 0.

We distinguish two cases.

Case 1:μ= 0. ThenAz≥0 andcTz <0. However, by assumption,Ax≤bhas
a solutionx 0. Then, forτlarge enough:

(40) A(x 0 −τ z)≤bandcT(x 0 −τ z)> δ.

This contradicts the fact thatAx≤bimpliescTx≤δ.

Case 2: μ >0. As (39) is homogeneous, we may assume thatμ= 1. Then for
x:=−zone has:

(41) Ax≤bandcTx > δ.

Again this contradicts the fact thatAx≤bimpliescTx≤δ.

Exercises


Section 2.4. Linear programming 33

```
2.15. Prove that there exists a vectorx≥0 such thatAx≤bif and only if for eachy≥ 0
satisfyingyTA≥0 one hasyTb≥0.
```
```
2.16. Prove that there exists a vectorx >0 such thatAx= 0 if and only if for eachy
satisfyingyTA≥0 one hasyTA= 0. (Stiemke’s theorem (Stiemke [1915]).)
```
```
2.17. Prove that there exists a vectorx 6 = 0 satisfyingx≥0 andAx= 0 if and only if
there is no vectorysatisfyingyTA >0. (Gordan’s theorem (Gordan [1873]).)
```
```
2.18. Prove that there exists a vectorxsatisfyingAx < bif and only ify= 0 is the only
solution fory≥ 0 ,yTA= 0,yTb≤0.
```
```
2.19. Prove that there exists a vectorxsatisfyingAx < bandA′x≤b′if and only if for all
vectorsy,y′≥0 one has:
```
```
(i) ifyTA+y′TA′= 0 thenyTb+y′Tb′≥0, and
(ii) ifyTA+y′TA′= 0 andy 6 = 0 thenyTb+y′Tb′>0.
```
```
(Motzkin’s theorem (Motzkin [1936]).)
```
```
2.20. LetAbe anm×nmatrix and letb∈Rm, withm≥n+ 1. Suppose thatAx≤b
has no solutionx. Prove that there exist indicesi 0 ,...,inso that the systemai 0 x≤
bi 0 ,...,ainx≤binhas no solutionx. Hereaiis theith row ofAandbiis theith
component ofb.
(Hint:Combine Farkas’ lemma with Carath ́eodory’s theorem.)
```
### 2.4. Linear programming

One of the standard forms of a linear programming (LP) problem is:

(42) maximizecTx,
subject toAx≤b.

So linear programming can be considered as maximizing a ‘linear function’cTxover
a polyhedron P = {x | Ax ≤ b}. Geometrically, this can be seen as shifting a
hyperplane to its ‘highest’ level, under the condition thatit intersectsP.
Problem (42) corresponds to determining the following maximum:

(43) max{cTx|Ax≤b}.

This is the form in which we will denote an LP-problem.
IfP={x|Ax≤b}is a nonempty polytope, then it is clear that max{cTx|Ax≤
b}is attained by avertexofP(cf. Exercise 2.21).
Clearly, also anyminimizationproblem can be transformed to form (43), since


34 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

(44) min{cTx|Ax≤b}=−max{−cTx|Ax≤b}.

One says thatxis afeasible solutionof (43) ifxsatisfiesAx≤b. Ifxmoreover
attains the maximum,xis called anoptimum solution.

The famous method to solve linear programming problems is thesimplex method,
designed by Dantzig [1951b]. The first polynomial-time method for LP-problems is
due to Khachiyan [1979,1980], based on theellipsoid method. In 1984, Karmarkar
[1984] published another polynomial-time method for linear programming, theinte-
rior point method, which turns out to be competitive in practice with the simplex
method.

The Duality theorem of linear programming, due to von Neumann[1947], states
that if the maximum (43) is finite, then the maximum value is equal to the minimum
value of another, so-calleddualLP-problem:

(45) min{yTb|y≥0;yTA=cT}.

In order to show this, we first prove:

Lemma 2.1. LetP be a polyhedron inRnand letc∈Rn. Ifsup{cTx|x∈P}is
finite, thenmax{cTx|x∈P}is attained.

Proof.Letδ:= sup{cTx|x∈P}. Choose matrixAand vectorbso thatP={x|
Ax≤b}. We must show that there exists anx∈Rnsuch thatAx≤bandcTx≥δ.

Suppose that such anxdoes not exist. Then by Farkas’ lemma, in the form of
Corollary 2.5a, there exists a vectory≥0 and a real numberλ≥0 such that:

(46) yTA−λcT= 0,yTb−λδ < 0.

This gives

(47) λδ=λsup{cTx|Ax≤b}= sup{λcTx|Ax≤b}= sup{yTAx|Ax≤b}≤
yTb < λδ,

a contradiction.

```
From this we derive:
```
Theorem 2.6(Duality theorem of linear programming).LetAbe anm×nmatrix,
b∈Rm,c∈Rn. Then

(48) max{cTx|Ax≤b}= min{yTb|y≥0;yTA=cT},


Section 2.4. Linear programming 35

provided that both sets are nonempty.

Proof.First note that

(49) sup{cTx|Ax≤b}≤inf{yTb|y≥0;yTA=cT},

because ifAx≤b, y≥ 0 , yTA=cT, then

(50) cTx= (yTA)x=yT(Ax)≤yTb.

As both sets are nonempty,the supremum and the infimum are finite. By Lemma 2.1
it suffices to show that we have equality in (49).
Letδ:= sup{cTx|Ax≤b}. Hence:

(51) ifAx≤bthencTx≤δ.

So by Corollary 2.5b there exists a vectorysuch that

(52) y≥ 0 , yTA=cT, yTb≤δ.

This implies that the infimum in (49) is at mostδ.

```
The Duality theorem can be interpreted geometrically as follows. Let
```
(53) max{cTx|Ax≤b}=:δ

be attained at a pointx∗. Without loss of generality we may assume that the firstk
rows ofAbelong to the matrixAx∗. Soa 1 x≤b 1 ,... , akx≤bkare those inequalities
in Ax ≤ bfor which aix∗ = bi holds. Elementary geometric insight (cf. Figure
2.1) gives thatcTx=δmust be a nonnegative linear combination of the equations
a 1 x=b 1 ,... , akx=bk.
That is, there existλ 1 ,... , λk≥0 such that:

(54) λ 1 a 1 +···+λkak=cT,
λ 1 b 1 +···+λkbk=δ.

Define

(55) y∗:= (λ 1 ,... , λk, 0 ,... ,0)T.

Theny∗ is a feasible solution for the dual problem min{yTb |y ≥ 0;yTA=cT}.
Therefore,


36 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

```
c
```
```
a x=b 2
2
```
```
c x=T
δ
```
```
a 1 a^2
```
```
P
```
```
x*
a x=b
1
1
```
```
Figure 2.1
```
(56) max{cTx|Ax≤b}=δ=λ 1 b 1 +···+λkbk≥min{yTb|y≥0;yTA=cT}.

Since trivially the converse inequality holds:

(57) max{cTx|Ax≤b}≤min{yTb|y≥0;yTA=cT}

(cf. (50)),y∗is an optimum solution of the dual problem.

```
There exist several variants of the Duality theorem.
```
Corollary 2.6a. LetAbe anm×nmatrix,b∈Rm, c∈Rn. Then

(58) max{cTx|x≥0;Ax=b}= min{yTb|yTA≥cT},

provided that both sets are nonempty.

Proof.Define

###### (59) A ̃:=

###### 

###### 

###### A

###### −A

###### −I

###### 

```
, ̃b:=
```
###### 

###### 

```
b
−b
0
```
###### 

###### .

Then

(60) max{cTx|x≥0;Ax=b}= max{cTx|Ax ̃ ≤ ̃b}=
min{zT ̃b|z≥0;zTA ̃=cT}=
min{uTb−vTb+wT 0 |u, v, w≥0;uTA−vTA−wT=cT}=
min{yTb|yTA≥cT}.


Section 2.4. Linear programming 37

The last equality follows by takingy:=u−v.

Exercises

```
2.21. LetP={x|Ax≤b}be a nonempty polytope. Prove that max{cTx|Ax≤b}is
attained by a vertex ofP.
```
```
2.22. LetP={x|Ax≤b}be a (not necessarily bounded) polyhedron, such thatPhas at
least one vertex. Prove that if max{cTx|Ax≤b}is finite, it is attained by a vertex
ofP.
```
```
2.23. Prove the following variant of the Duality theorem:
```
```
(61) max{cTx|x≥0;Ax≤b}= min{yTb|y≥0;yTA≥cT}
```
```
(assuming both sets are nonempty).
```
```
2.24. Prove the following variant of the Duality theorem:
```
```
(62) max{cTx|Ax≥b}= min{yTb|y≤0;yTA=cT}
```
```
(assuming both sets are nonempty).
```
```
2.25. Let a matrix, a column vector, and a row vector be given:
```
```
(63)
```
```


```
```
A B C
D E F
G H K
```
```

,
```
```


```
```
a
b
c
```
```

,(d e f),
```
```
whereA,B,C,D,E,F,G,H,Kare matrices,a,b,care column vectors, andd,e,fare
row vectors (of appropriate dimensions). Then
```
```
(64) max{dx+ey+fz| x≥0;z≤0;
Ax+By+Cz≤a;
Dx+Ey+Fz=b;
Gx+Hy+Kz≥c}
= min{ua+vb+wc| u≥0;w≤0;
uA+vD+wG≥d;
uB+vE+wH=e;
uC+vF+wK≤f},
```
```
assuming that both sets are nonempty.
```

38 Chapter 2. Polytopes, polyhedra, Farkas’ lemma, and linearprogramming

```
2.26. Give an example of a matrixAand vectorsbandcfor which both{x|Ax≤b}and
{y|y≥0;yTA=cT}are empty.
```
```
2.27. Let ̃xbe a feasible solution of max{cTx|Ax≤b}and let ̃y be a feasible solution
of min{yTb|y≥0;yTA=cT}. Prove that ̃xand ̃yare optimum solutions of the
maximum and minimum, respectively if and only if for eachi= 1,...,mone has:
y ̃i= 0 oraix ̃=bi.
(HereAhasmrows andaidenotes theith row ofA.)
```
```
2.28. LetAbe anm×nmatrix and letb∈Rm. Let{x|Ax≤b}be nonempty and let
Cbe the convex cone{x|Ax≤ 0 }. Prove that the set of all vectorscfor which
max{cTx|Ax≤b}is finite, is equal toC∗.
```

###### 39

## 3. Matchings and covers in bipartite graphs

### 3.1. Matchings, covers, and Gallai’s theorem

LetG= (V, E) be a graph. Astable setis a subsetCofV such thate6⊆Cfor each
edgeeofG. Avertex coveris a subsetW ofV such thate∩W 6 =∅for each edgee
ofG. It is not difficult to show that for eachU⊆V:

(1) Uis a stable set⇐⇒V\Uis a vertex cover.

Amatchingis a subsetM ofEsuch thate∩e′=∅for alle, e′ ∈M withe 6 =e′.
A matching is calledperfectif it covers all vertices (that is, has size^12 |V|). Anedge
cover is a subsetF of Esuch that for each vertexvthere exists e∈F satisfying
v∈e. Note that an edge cover can exist only ifGhas no isolated vertices.
Define:

(2) α(G) := max{|C||Cis a stable set},
τ(G) := min{|W||W is a vertex cover},
ν(G) := max{|M||M is a matching},
ρ(G) := min{|F||Fis an edge cover}.

These numbers are called thestable set number, thevertex cover number, thematching
number, and theedge cover numberofG, respectively.
It is not difficult to show that:

(3) α(G)≤ρ(G) andν(G)≤τ(G).

The triangleK 3 shows that strict inequalities are possible. In fact, equality in one of
the relations (3) implies equality in the other, as Gallai [1958,1959] proved:

Theorem 3.1(Gallai’s theorem).For any graphG= (V, E)without isolated vertices
one has

(4) α(G) +τ(G) =|V|=ν(G) +ρ(G).

Proof.The first equality follows directly from (1).
To see the second equality, first letMbe a matching of sizeν(G). For each of the
|V|− 2 |M|verticesvmissed byM, add toM an edge coveringv. We obtain an edge
cover of size|M|+ (|V|− 2 |M|) =|V|−|M|. Henceρ(G)≤|V|−ν(G).


```
40 Chapter 3. Matchings and covers in bipartite graphs
```
```
Second, letFbe an edge cover of sizeρ(G). For eachv∈Vdelete fromF,dF(v)− 1
edges incident withv. We obtain a matching of size at least|F|−
```
###### ∑

```
v∈V(dF(v)−1) =
|F|−(2|F|−|V|) =|V|−|F|. Henceν(G)≥|V|−ρ(G).
```
```
This proof also shows that if we have a matching of maximum cardinality in any
graphG, then we can derive from it a minimum cardinality edge cover,and conversely.
```
```
Exercises
```
```
3.1. LetG= (V,E) be a graph without isolated vertices. Define:
```
```
(5) α 2 (G) := the maximum number of vertices such that no edge
contains more than two of these vertices;
ρ 2 (G) := the minimum number of edges such that each vertex
is contained in at least two of these edges;
τ 2 (G) := the minimum number of vertices such that each edge
contains at least two of these vertices
ν 2 (G) := the maximum number of edges such that no vertex is
contained in more than two of these edges;
```
```
possibly taking vertices (edges, respectively) more than once.
```
```
(i) Show thatα 2 (G)≤ρ 2 (G) and thatν 2 (G)≤τ 2 (G).
(ii) Show thatα 2 (G) +τ 2 (G) = 2|V|.
(iii) Show thatν 2 (G) +ρ 2 (G) = 2|V|.
```
### 3.2. M-augmenting paths

```
Basic in matching theory areM-augmenting paths, which are defined as follows. Let
M be a matching in a graphG= (V, E). A pathP = (v 0 , v 1 ,... , vt) inGis called
M-augmentingif
```
(6) (i)tis odd,
(ii)v 1 v 2 , v 3 v 4 ,... , vt− 2 vt− 1 ∈M,
(iii)v 0 , vt6∈

###### ⋃

###### M.

```
Note that this implies thatv 0 v 1 , v 2 v 3 ,... , vt− 1 vtdo not belong toM.
```
```
Clearly, ifP= (v 0 , v 1 ,... , vt) is anM-augmenting path, then
```
```
(7) M′:=M△EP
```

Section 3.3. K ̋onig’s theorems 41

```
edge in M
edge not in M vertexnotcovered byM
```
```
vertex covered byM
```
```
Figure 3.1
```
is a matching satisfying|M′|=|M|+ 1.^8
In fact, it is not difficult to show that:

Theorem 3.2. LetG= (V, E)be a graph and letM be a matching inG. Then
either M is a matching of maximum cardinality, or there exists anM-augmenting
path.

Proof.IfMis a maximum-cardinality matching, there cannot exist anM-augmenting
pathP, since otherwiseM△EPwould be a larger matching.
IfM′is a matching larger thanM, consider the components of the graphG′:=
(V, M∪M′). AsG′ has maximum valency two, each component ofG′is either a
path (possibly of length 0) or a circuit. Since |M′| > |M|, at least one of these
components should contain more edges ofM′than ofM. Such a component forms
anM-augmenting path.

### 3.3. K ̋onig’s theorems

A classical min-max relation due to K ̋onig [1931] (extending a result of Frobenius
[1917]) characterizes the maximum size of a matching in a bipartite graph (we follow
the proof of De Caen [1988]):

Theorem 3.3(K ̋onig’s matching theorem).For any bipartite graphG= (V, E)one
has

(8) ν(G) =τ(G).

That is, the maximum cardinality of a matching in a bipartitegraph is equal to the
minimum cardinality of a vertex cover.

Proof.By (3) it suffices to show thatν(G)≥τ(G). We may assume thatGhas at
least one edge. Then:

(9) Ghas a vertexucovered by each maximum-size matching.

(^8) EPdenotes the set of edges inP.△denotes symmetric difference.


42 Chapter 3. Matchings and covers in bipartite graphs

To see this, lete=uvbe any edge ofG, and suppose that there are maximum-size
matchingsMandNmissinguandvrespectively^9. LetPbe the component ofM∪N
containingu. SoPis a path with end vertexu. SincePis notM-augmenting (asM
has maximum size),Phas even length, and hence does not traversev(otherwise,P
ends atv, contradicting the bipartiteness ofG). SoP∪ewould form anN-augmenting
path, a contradiction (asN has maximum size). This proves (9).
Now (9) implies that for the graphG′ := G−uone has ν(G′) = ν(G)−1.
Moreover, by induction,G′ has a vertex coverC of size ν(G′). ThenC∪{u}is a
vertex cover ofGof sizeν(G′) + 1 =ν(G).

```
Combination of Theorems 3.1 and 3.3 yields the following result of K ̋onig [1932].
```
Corollary 3.3a(K ̋onig’s edge cover theorem). For any bipartite graphG= (V, E),
without isolated vertices, one has

(10) α(G) =ρ(G).

That is, the maximum cardinality of a stable set in a bipartite graph is equal to the
minimum cardinality of an edge cover.

Proof.Directly from Theorems 3.1 and 3.3, asα(G) =|V|−τ(G) =|V|−ν(G) =
ρ(G).

Exercises

```
3.2. (i) Prove that ak-regular bipartite graph has a perfect matching (ifk≥1).
(ii) Derive that ak-regular bipartite graph haskdisjoint perfect matchings.
(iii) Give for eachk > 1 an example of a k-regular graph not having a perfect
matching.
```
```
3.3. Prove that in a matrix, the maximum number of nonzero entries with no two in the
same line (=row or column), is equal to the minimum number of lines that include
all nonzero entries.
```
```
3.4. LetA= (A 1 ,...,An) be a family of subsets of some finite setX. A subsetY ofXis
called atransversalor asystem of distinct representatives(SDR) ofAif there exists
a bijectionπ:{ 1 ,...,n}→Y such thatπ(i)∈Aifor eachi= 1,...,n.
Decide if the following collections have an SDR:
```
```
(i){ 3 , 4 , 5 },{ 2 , 5 , 6 },{ 1 , 2 , 5 },{ 1 , 2 , 3 },{ 1 , 3 , 6 },
(ii){ 1 , 2 , 3 , 4 , 5 , 6 },{ 1 , 3 , 4 },{ 1 , 4 , 7 },{ 2 , 3 , 5 , 6 },{ 3 , 4 , 7 },{ 1 , 3 , 4 , 7 },{ 1 , 3 , 7 }.
```
(^9) Mmissesa vertexuifu6∈⋃M. Here⋃Mdenotes the union of the edges inM; that is, the
set of vertices covered by the edges inM.


Section 3.3. K ̋onig’s theorems 43

```
3.5. LetA= (A 1 ,...,An) be a family of subsets of some finite setX. Prove thatAhas
an SDR if and only if
```
```
(11)
```
```
∣∣⋃
```
```
i∈I
```
```
Ai
```
```
∣∣
≥|I|
```
```
for each subsetIof{ 1 ,...,n}.
[Hall’s ‘marriage’ theorem (Hall [1935]).]
```
```
3.6. LetA= (A 1 ,...,An) be subsets of the finite setX. A subsetY ofXis called a
partial transversalor apartial system of distinct representatives(partial SDR) if it is
a transversal of some subcollection (Ai 1 ,...,Aik) of (A 1 ,...,An).
Show that the maximum cardinality of a partial SDR ofAis equal to the minimum
value of
```
```
(12) |X\Z|+|{i|Ai∩Z 6 =∅}|,
```
```
whereZranges over all subsets ofX.
```
```
3.7. LetA= (A 1 ,...,An) be a family of finite sets and letkbe a natural number. Show
thatAhaskpairwise disjoint SDR’s ofAif and only if
```
```
(13)
```
```
∣
∣
```
```
⋃
```
```
i∈I
```
```
Ai
```
```
∣
∣≥k|I|
```
```
for each subsetIof{ 1 ,...,n}.
```
```
3.8. LetA= (A 1 ,...,An) be a family of subsets of a finite setXand letkbe a natural
number. Show thatXcan be partitioned intokpartial SDR’s if and only if
```
```
(14) k·|{i|Ai∩Y 6 =∅}|≥|Y|
```
```
for each subsetY ofX.
(Hint:Replace eachAibykcopies ofAiand use Exercise 3.6 above.)
3.9. Let (A 1 ,...,An) and (B 1 ,...,Bn) be two partitions of the finite setX.
```
```
(i) Show that (A 1 ,...,An) and (B 1 ,...,Bn) have acommonSDR if and only if for
each subsetI of{ 1 ,...,n}, the set
```
```
⋃
i∈IAiintersects at least|I|sets among
B 1 ,...,Bn.
(ii) Suppose that|A 1 | = ···= |An| = |B 1 |= ··· = |Bn|. Show that the two
partitions have a common SDR.
```
```
3.10. Let (A 1 ,...,An) and (B 1 ,...,Bn) be two partitions of the finite setX. Show that the
minimum cardinality of a subset ofXintersecting each set amongA 1 ,...,An,B 1 ,...,
Bnis equal to the maximum number of pairwise disjoint sets inA 1 ,...,An,B 1 ,...,Bn.
```

44 Chapter 3. Matchings and covers in bipartite graphs

```
3.11. A matrix is calleddoubly stochasticif it is nonnegative and each row sum and each
column sum is equal to 1. A matrix is called apermutation matrixif each entry is 0
or 1 and each row and each column contains exactly one 1.
```
```
(i) Show that for each doubly stochastic matrixA= (ai,j)ni,j=1there exists a per-
mutationπ∈Snsuch thatai,π(i) 6 = 0 for alli= 1,...,n.
(ii) Derive that each doubly stochastic matrix is a convex linear combination of
permutation matrices.
```
```
[Birkhoff-von Neumann theorem (Birkhoff [1946], von Neumann[1953]).]
```
```
3.12. LetG= (V,E) be a bipartite graph with colour classesU andW. Letb:V →Z+
be so that
```
```
∑
v∈Ub(v) =
```
```
∑
v∈Wb(v) =:t.
Ab-matchingis a functionc:E→Z+so that for each vertexvofG:
```
```
(15)
```
```
∑
```
```
e∈E,v∈e
```
```
c(e) =b(v)
```
```
Show that there exists ab-matching if and only if
```
```
(16)
```
```
∑
```
```
v∈X
```
```
b(v)≥t
```
```
for each vertex coverX.
```
```
3.13. LetG= (V,E) be a bipartite graph and letb:V →Z+. Show thatGhas a subgraph
G′= (V,E′) such that degG′(v) =b(v) for eachv∈V if and only if eachX⊆V
contains at least
```
```
(17)
1
2
```
```
(
```
```
∑
```
```
v∈X
```
```
b(v)−
```
```
∑
```
```
v∈V\X
```
```
b(v))
```
```
edges.
```
```
3.14. LetG= (V,E) be a bipartite graph and letb:V →Z+. Show that the maximum
number of edges in a subsetF ofEso that each vertexvofGis incident with at
mostb(v) of the edges inF, is equal to
```
```
(18) min
X⊆V
```
```
∑
```
```
v∈X
```
```
b(v) +|E(V\X)|.
```
```
3.15. LetG= (V,E) be a bipartite graph and let k∈ N. Prove thatGhaskdisjoint
perfect matchings if and only if eachX⊆V contains at leastk(|X|−^12 |V|) edges.
```
```
3.16. Show that each 2k-regular graph contains a setF of edges so that each vertex is
incident with exactly two edges inF.
```

Section 3.4. Cardinality bipartite matching algorithm 45

### 3.4. Cardinality bipartite matching algorithm

We now focus on the problem of finding a maximum-sized matching in a bipartite
graph algorithmically.

In any graph, if we have an algorithm finding anM-augmenting path for any
matching M (if it exists), then we can find a maximum cardinality matching: we
iteratively find matchingsM 0 , M 1 ,.. ., with|Mi|=i, until we have a matchingMk
such that there does not exist anyMk-augmenting path.
We now describe how to find anM-augmenting path in a bipartite graph.

Matching augmenting algorithm for bipartite graphs

input: a bipartite graphG= (V, E) and a matchingM,
output: a matchingM′satisfying|M′|>|M|(if there is one).
description of the algorithm: LetGhave colour classesU andW. Orient each
edgee={u, w}ofG(withu∈U, w∈W) as follows:

(19) ife∈M then orientefromwtou,
ife6∈M then orientefromutow.

LetDbe the directed graph thus arising. Consider the sets

###### (20) U′:=U\

###### ⋃

```
MandW′:=W\
```
###### ⋃

###### M.

Now anM-augmenting path (if it exists) can be found by finding a directed path
inDfrom any vertex inU′to any vertex inW′. Hence in this way we can find a
matching larger thanM.

```
This implies:
```
Theorem 3.4. A maximum-size matching in a bipartite graph can be found in time
O(|V||E|).

Proof. The correctness of the algorithm is immediate. Since a directed path can
be found in timeO(|E|), we can find an augmenting path in timeO(|E|). Hence a
maximum cardinality matching in a bipartite graph can be found in timeO(|V||E|)
(as we do at most|V|iterations).

```
Hopcroft and Karp [1973] gave anO(|V|^1 /^2 |E|) algorithm.
```
Application 3.1: Assignment problem. Suppose we havekmachines at our disposal:
m 1 ,...,mk. On a certain day we have to carry outnjobs: j 1 ,...,jn. Each machines
is capable of performing some jobs, but can do only one job a day. E.g., we could have


46 Chapter 3. Matchings and covers in bipartite graphs

five machinesm 1 ,...,m 5 and five jobsj 1 ,...,j 5 and the capabilities of the machines are
indicated by crosses in the following table:

```
j 1 j 2 j 3 j 4 j 5
m 1 X X X
m 2 X X X X
m 3 X X
m 4 X
m 5 X
```
We want to assign the machines to the jobs in such a way that every machine performs
at most one job and that a largest number of jobs is carried out.
In order to solve this problem we represent the machines and jobs by verticesm 1 ,...,mk
andj 1 ,...,jnof a bipartite graphG= (V,E), and we make an edge frommitojjif jobj
can be performed by machinei. Thus the example gives Figure 3.2. Then a maximum-size
matching inGcorresponds to a maximum assignment of jobs.

```
3
```
```
4
```
```
2
```
```
m 1
```
```
m
```
```
m 3
```
```
m 4
```
```
m 5 j 5
```
```
j
```
```
j
```
```
j 2
```
```
j 1
```
```
Figure 3.2
```
Exercises

```
3.17. Find a maximum-size matching and a minimum vertex cover in the bipartite graph
in Figure 3.3.
```
```
3.18. Solve the assignment problem given in Application 3.1.
```
```
3.19. Derive K ̋onig’s matching theorem from the cardinality matching algorithm for bipar-
tite graphs.
```
```
3.20. Show that a minimum-size vertex cover in a bipartite graph can be found in polyno-
mial time.
```
```
3.21. Show that, given a family of sets, a system of distinct representatives can be found
in polynomial time (if it exists).
```

Section 3.5. Weighted bipartite matching 47

```
1
```
```
a b c d e f
```
```
2 3 4 5
```
```
g h i j
```
(^678910)
Figure 3.3

### 3.5. Weighted bipartite matching

We now consider the problem of finding a matching of maximum weight for which
we describe the so-calledHungarian methoddeveloped by Kuhn [1955], using work of
Egerv ́ary [1931] (see Corollary 3.7b below).
LetG= (V, E) be a graph and letw :E→Rbe a ‘weight’ function. For any
subsetM ofEdefine theweightw(M) ofMby

(21) w(M) :=

###### ∑

```
e∈M
```
```
w(e).
```
The maximum-weight matching problem consists of finding a matching of maximum
weight.
Again, augmenting paths are of help at this problem. Call a matchingMextreme
if it has maximum weight among all matchings of cardinality|M|.
LetMbe an extreme matching. Define a ‘length’ functionl:E→Ras follows:

(22) l(e) :=

###### {

```
w(e) ife∈M,
−w(e) ife6∈M.
```
Then the following holds:

Proposition 1. Let P be anM-augmenting path of minimum length. IfM is
extreme, thenM′:=M△EP is extreme again.

Proof.LetN be any extreme matching of size|M|+ 1. As|N|>|M|,M∪Nhas
a component Qthat is anM-augmenting path. AsP is a shortestM-augmenting
path, we knowl(Q)≥l(P). Moreover, asN△EQis a matching of size|M|, and as
M is extreme, we knoww(N△EQ)≤w(M). Hence

(23) w(N) =w(N△EQ)−l(Q)≤w(M)−l(P) =w(M′).

HenceM′is extreme.


48 Chapter 3. Matchings and covers in bipartite graphs

This implies that if we are able to find a minimum-lengthM-augmenting path in
polynomial time, we can find a maximum-weight matching in polynomial time: find
iteratively extreme matchingsM 0 , M 1 ,.. .such that|Mk|=kfor eachk. Then the
matching amongM 0 , M 1 ,.. .of maximum weight is a maximum-weight matching.
IfGis bipartite, we can find a minimum-lengthM-augmenting path as follows. Let
Ghave colour classesUandW. Orient the edges ofGas in (19), making the directed
graphD, and letU′andW′as in (20). Then a minimum-lengthM-augmenting path
can be found by finding a minimum-length path inDfrom any vertex inU′to any
vertex inW′. This can be done in polynomial time, since:

Theorem 3.5. LetM be an extreme matching. ThenDhas no directed circuit of
negative length.

Proof.SupposeCis a directed circuit inDwith lengthl(C)<0. We may assume
C = (u 0 , w 1 , u 1 ,... , wt, ut) withu 0 =ut andu 1 ,... , ut ∈U andw 1 ,... , wt ∈W.
Then the edgesw 1 u 1 ,... , wtutbelong toM and the edgesu 0 w 1 , u 1 w 2 ,... , ut− 1 wtdo
not belong toM. ThenM′′ :=M△ECis a matching of cardinalityk of weight
w(M′′) =w(M)−l(C)> w(M), contradicting the fact thatM is extreme.

This gives a polynomial-time algorithm to find a maximum-weight matching in a
bipartite graph. The description above yields:

Theorem 3.6.A maximum-weight matching in a bipartite graphG= (V, E)can be
found inO(|V|^2 |E|)time.

Proof.We doO(|V|) iterations, each consisting of finding a shortest path (in agraph
without negative-length directed circuits), which can be done inO(|V||E|) time (with
the Bellman-Ford algorithm — see Corollary 1.10a).

In fact, a sharpening of this method (by transmitting a ‘potential’p:V →Q
throughout the matching augmenting iterations, making thelength functionlnon-
negative, so that Dijkstra’s method can be used) gives anO(|V|(|E|+|V|log|V|))
algorithm.

Application 3.2: Optimal assignment. Suppose that we havenjobs andmmachines
and that each job can be done on each machine. Moreover, let a cost function (or cost
matrix)ki,jbe given, specifying the cost of performing jobj by machinei. We want to
perform the jobs with a minimum of total costs.
This can be solved with the maximum-weight bipartite matching algorithm. To this
end, we make a complete bipartite graphGwith colour classes of cardinalitymandn. Let
Kbe the maximum ofki,jover alli,j. Define the weight of the edge connecting machinei
and jobjto be equal toK−ki,j. Then a maximum-weight matching inGcorresponds to


Section 3.5. Weighted bipartite matching 49

an optimum assignment of machines to jobs.
So the algorithm for solving the assignment problem counters the remarks made by
Thorndike [1950] in an Address delivered on September 9, 1949 at a meeting of the American
Psychological Association at Denver, Colorado:

```
There are, as has been indicated, a finite number of permutations in the assign-
ment of men to jobs. When the classification problem as formulated above was
presented to a mathematician, he pointed to this fact and said that from the
point of view of the mathematician there was no problem. Since the number of
permutations was finite, one had only to try them all and choose the best. He
dismissed the problem at that point. This is rather cold comfort to the psy-
chologist, however, when one considers that only ten men andten jobs mean
over three and a half million permutations. Trying out all the permutations
may be a mathematical solution to the problem, it is not a practical solution.
```
Application 3.3: Transporting earth. Monge [1784] was one of the first to consider
the assignment problem, in the role of the problem of transporting earth from one area to
another, which he considered as the discontinuous, combinatorial problem of transporting
molecules:

```
Lorsqu’on doit transporter des terres d’un lieu dans un autre, on a coutime de
donner le nom deD ́eblaiau volume des terres que l’on doit transporter, & le
nom deRemblai`a l’espace qu’elles doivent occuper apr`es le transport.
Le prix du transport d’une mol ́ecule ́etant, toutes choses d’ailleurs ́egales, pro-
portionnel `a son poids & `a l’espace qu’on lui fait parcourir, & par cons ́equent le
prix du transport total devant ˆetre proportionnel `a la somme des produits des
mol ́ecules multipli ́ees chacune par l’espace parcouru, ils’ensuit que le d ́eblai &
le remblai ́etant donn ́e de figure & de position, il n’est pas indiff ́erent que telle
mol ́ecule du d ́eblai soit transport ́ee dans tel ou tel autreendroit du remblai,
mais qu’il y a une certaine distribution `a faire des mol ́ecules du premier dans
le second, dapr`es laquelle la somme de ces produits sera la moindre possible, &
le prix du transport total seraminimum.^10
```
Monge describes an interesting geometric method to solve the assignment problem in this
case: letlbe a line touching the two areas from one side; then transport the earth molecule

(^10) When one must transport earth from one place to another, one usually gives the name ofD ́eblai
to the volume of earth that one must transport, & the name ofRemblaito the space that they
should occupy after the transport.
The price of the transport of one molecule being, if all the rest is equal, proportional to its weight
& to the distance that one makes it covering, & hence the priceof the total transport having to be
proportional to the sum of the products of the molecules eachmultiplied by the distance covered,
it follows that, the d ́eblai & the remblai being given by figure and position, it makes difference if a
certain molecule of the d ́eblai is transported to one or to another place of the remblai, but that there
is a certain distribution to make of the molcules from the first to the second, after which the sum of
these products will be as little as possible, & the price of the total transport will be aminimum.


50 Chapter 3. Matchings and covers in bipartite graphs

touched in one area to the position touched in the other area. Then repeat, until all
molecules are transported.

Exercises

```
3.22. Five mechanics, stationed in the citiesA,B,C,D,E, have to perform jobs in the cities
F,G,H,I,J. The jobs must be assigned in such a way to the mechanics that everyone
gets one job and that the total distance traveled by them is assmall as possible. The
distances are given in the tables below. Solve these assignment problems with the
weighted matching algorithm.
```
```
(i)
```
```
F G H I J
A 6 17 10 1 3
B 9 23 21 4 5
C 2 8 5 0 1
D 19 31 19 20 9
E 21 25 22 3 9
```
```
(ii)
```
```
F G H I J
A 11 5 21 7 18
B 17 4 20 9 25
C 4 1 3 2 4
D 6 2 19 3 9
E 19 7 23 18 26
```
```
3.23. Derive from the weighted matching algorithm for bipartite graphs an algorithm for
finding a minimum-weight perfect matching in a bipartite graphG= (V,E). (A
matchingMisperfectif
```
```
⋃
M=V.)
```
```
3.24. LetA 1 ,...,An be subsets of the finite setX and letw :X →R+be a ‘weight’
function. Derive from the weighted matching algorithm a polynomial-time algorithm
to find a minimum-weight SDR.
```
### 3.6. The matching polytope

The weighted matching problem is related to the ‘matching polytope’. LetG= (V, E)
be a graph. For each matchingM let theincidence vectorχM :E →Rof M be
defined by:

(24) χM(e) := 1 ife∈M,
χM(e) := 0 ife6∈M,


Section 3.6. The matching polytope 51

fore∈E.

It is important to realize that the set of functionsf:E→Rcan be considered
as a vector space and each such function as a vector. Thus we can denotef(e) byfe.
The functionχMcan be considered alternatively as a vector in the vector spaceRE.
Similarly for functionsg:V →R.

```
Thematching polytopeofGis defined as:
```
(25) Pmatching(G) :=conv.hull{χM|M is a matching inG}.

SoPmatching(G) is a polytope inRE.

The matching polytope is a polyhedron, and hence can be described by linear
inequalities. For bipartite graphs, these inequalities are quite simple. To this end
it is convenient first to consider⋃ perfect matchings. (A matching M isperfect if
M=V.) Now theperfect matching polytopeofGis defined by:

(26) Pperfect matching(G) :=conv.hull{χM|M is a perfect matching inG}.

Again,Pperfect matching(G) is a polytope inRE. Now the following can be derived quite
directly from Exercise 3.11:

Theorem 3.7. LetG = (V, E)be a bipartite graph. Then the perfect matching
polytopePperfect matching(G)is equal to the set of vectorsx∈REsatisfying:

(27) ∑xe ≥0 for eache∈E;

```
e∋v
```
```
xe = 1 for eachv∈V.
```
Proof.Left to the reader (Exercise 3.25).

Clearly, each vectorxinPperfect matching(G) should satisfy (27), since each vector
χMsatisfies (27). The essence of the theorem is that the inequalities (27) are enough
to define the polytopePperfect matching(G).
(An alternative way of proving Theorem 3.7 is using the ‘totalunimodularity’ of
the incidence matrix of a bipartite graph, together with theHoffman-Kruskal theorem
on integer solutions to linear programming problems with integer data and totally
unimodular constraint matrix — see Section 8.3.)
From Theorem 3.7 one can derive the linear inequalities describing the matching
polytope of a bipartite graph:

Corollary 3.7a. LetG= (V, E)be a bipartite graph. Then the matching polytope
Pmatching(G)is equal to the set of vectorsx∈REsatisfying:


52 Chapter 3. Matchings and covers in bipartite graphs

(28) ∑xe ≥0 for eache∈E;

```
e∋v
```
```
xe ≤1 for eachv∈V.
```
Proof.Left to the reader (Exercise 3.26).

Clearly, one cannot delete the bipartiteness condition: ifGis the triangleK 3 then
the functionxdefined byxe:= 1/2 for each edgeesatisfies (28), but does not belong
to the matching polytope.
Corollary 3.7a asserts that the weighted matching problem can be formulated as
a linear programming problem:

(29) maximize wTx,
subject to ∑xe ≥0 for eache∈E;

```
e∋v
```
```
xe ≤1 for eachv∈V.
```
With linear programming duality one can derive from this a ‘weighted’ extension
of K ̋onig’s matching theorem, due to Egerv ́ary [1931]:

Corollary 3.7b. LetG= (V, E)be a bipartite graph and letw:E→Rbe a ‘weight’
function. Then the maximum weight of a matching is equal to th∑ e minimum value of

v∈Vy(v), whereyranges over all functionsy:V→R+satisfyingy(u)+y(v)≥w(e)
for each edgee=uvofG.

Proof.The maximum weight of a matching inGis equal to

(30) max{wTχM|Mis a matching inG}.

SincePmatching(G) is the convex hull of theχM, (30) is equal to

(31) max{wTx|x∈Pmatching(G)}.

By Corollary 3.7a this is equal to

(32) max{wTx| ∑ xe ≥0 for eache∈E;

```
e∋vxe ≤1 for eachv∈V}.
```
By linear programming duality this is equal to

(33) min{

###### ∑

```
v∈Vyv| yv ≥0 for eachv∈V;
yu+yv ≥we for each edgee=uv}.
```

Section 3.6. The matching polytope 53

This is exactly the minimum described in the Corollary.

An extension of this corollary gives a further extension of K ̋onig’s matching the-
orem (Theorem 3.3):

Theorem 3.8. In Corollary 3.7b, if w is integer-valued, then we can take alsoy
integer-valued.

Proof.Lety∈RV+attain the minimum, and assume that we have chosenyso that
the number of verticesvwithyv6∈Zis as small as possible. LetUandWbe the two
colour classes ofGand letXbe the set of verticesvofGwithyv6∈Z. IfX=∅we
are done, so assume thatX 6 =∅. Without loss of generality,|X∩U|≥|X∩W|. Let
ube a vertex inX∩Uwithyu−⌊yu⌋as small as possible. Letε:=yu−⌊yu⌋. Reset

(34) y ̃v:=

###### 

###### 

###### 

```
yv−ε ifv∈X∩U,
yv+ε ifv∈X∩W,
yv ifv6∈X.
```
One easily checks that again ̃yv+ ̃yv′≥w(e) for each edgee=vv′ofG(using the fact
thatwis integer-valued). Moreover,

###### ∑

```
v∈Vy ̃v=
```
###### ∑

∑ v∈Vyv−ε|X∩U|+ε|X∩W| ≤
v∈Vyv. So ̃yalso attains the minimum. However, ̃yhas fewer noninteger-valued
components thany(as ̃yu∈Z), contradicting our assumption.

Exercises

```
3.25. Derive Theorem 3.7 from Exercise 3.11.
```
```
3.26. Derive Corollary 3.7a from Theorem 3.7.
```

54 Chapter 4. Menger’s theorem, flows, and circulations

## 4. Menger’s theorem, flows, and circulations

### 4.1. Menger’s theorem

In this section we study the maximum numberkof pairwise disjoint paths in a graph
connecting two vertices, or two sets of vertices. Here ‘disjoint’ can mean: vertex-
disjoint(= having no vertex in common), orinternally vertex-disjoint(= having no
vertex in common except for their end vertices), orarc-disjoint(= having no arc in
common). By the way, we often say ‘disjoint’ to mean ‘pairwise disjoint’.
LetD= (V, A) be a directed graph and letSandT be subsets ofV. A path is
called anS−T pathif it runs from a vertex inSto a vertex inT.
Menger [1927] gave a min-max theorem for the maximum number of disjointS−T
paths. We follow the proof given by G ̈oring [2000].
A setCof vertices is calledS−T disconnectingifCintersects eachS−T path
(Cmay intersectS∪T).

Theorem 4.1(Menger’s theorem (directed vertex-disjoint version)). LetD= (V, A)
be a digraph and letS, T ⊆V. Then the maximum number of vertex-disjointS−T
paths is equal to the minimum size of anS−T disconnecting vertex set.

Proof.Obviously, the maximum does not exceed the minimum. Equality is shown
by induction on|A|, the caseA=∅being trivial.
Letk be the minimum size of anS−T disconnecting vertex set. Choosea=
(u, v)∈A. If eachS−T disconnecting vertex set inD−ahas size at leastk, then
inductively there existkvertex-disjointS−Tpaths inD−a, hence inD.
So we can assume thatD−ahas anS−T disconnecting vertex setC of size
≤k−1. ThenC∪{u}andC∪{v}areS−T disconnecting vertex sets ofDof size
k. So|C|=k−1.
Now eachS−(C∪{u}) disconnecting vertex setBofD−ahas size at leastk, as
it isS−T disconnecting inD. Indeed, eachS−TpathPinDintersectsC∪{u},
and hencePcontains anS−(C∪{u}) path inD−a. SoPintersectsB.
So by induction,D−acontainskdisjointS−(C∪{u}) paths. As|C∪{u}|=k,
this means that for eachc∈C∪{u}there exists anS−cpath Pcsuch that for
distinctc, c′∈C∪{u},PcandPc′are disjoint. So eachPcintersectsC∪{u}only in
c.
Similarly, there exists for eachc∈U∪{v}ac−T path such that for distinct
c, c′∈C∪{v},QcandQc′ are disjoint. Again, eachQcintersectsC∪{v}only inc.
Note that forc∈C∪{u}andc′∈C∪{v}, ifPcandQc′intersect in some vertex
w, thenc=w=c′. For suppose not. By symmetry we can assume thatw 6 =c. Then
w6∈C∪{u}, as otherwisePcandPwwould intersect. Then the concatenation of the


Section 4.1. Menger’s theorem 55

S−wpart ofPcand thew−Tpart ofQc′is a walk fromStoT inD−aavoiding
C (also in casew=v). This contradicts the fact thatCisS−T disconnecting for
D−a.
For eachc∈C, letRcbe theS−Tpath obtained by concatenatingPcandQc.
Moreover, letRbe theS−Tpath obtained by concatenatingPu, arca= (u, v), and
Qv. By the above, the pathsRc(c∈C) andRformkpairwise disjointS−Tpaths.

A consequence of this theorem is a variant oninternally vertex-disjoints−tpaths,
that is,s−tpaths having no vertex in common except forsandt. Recall that a set
Uof vertices is called ans−tvertex-cutifs, t6∈Uand eachs−tpath intersectsU.

Corollary 4.1a(Menger’s theorem (directed internally vertex-disjoint version)).Let
D= (V, A)be a digraph and letsandtbe two distinct and nonadjacent vertices of
D. Then the maximum number of internally vertex-disjoints−tpaths is equal to the
minimum size of ans−tvertex-cut.

Proof.LetD′:=D−s−tand letSandT be the sets of outneighbours ofsand
of inneighbours oft, respectively. Then Theorem 4.1 applied toD′, S, T gives the
corollary.

In turn, Theorem 4.1 follows from Corollary 4.1a by adding two new verticess
andtand arcs (s, v) for allv∈Sand (v, t) for allv∈T.
Also an arc-disjoint version can be derived (where paths arearc-disjointif they
have no arc in common).
Recall that a setC of arcs is ans−tcutifC=δout(U) for some subsetUofV
withs∈Uandt6∈U.

Corollary 4.1b(Menger’s theorem (directed arc-disjoint version)).LetD= (V, A)
be a digraph ands, t∈V withs 6 =t. Then the maximum number of arc-disjoints−t
paths is equal to the minimum size of ans−tcut.

Proof. LetL(D) be the line digraph ofDand letS :=δout(s) andT := δin(t).^11
Then Theorem 4.1 forL(D), S, Timplies the corollary. Note that a minimum-size set
of arcs intersecting eachs−tpath necessarily is ans−tcut. Moreover, anS−T
path inL(D) yields ans−twalk inD, which contains ans−tpath inD. Hence
disjoint paths inL(D) yield arc-disjoint paths inD.

The internally vertex-disjoint version of Menger’s theorem can be derived in turn
from the arc-disjoint version: make a digraph D′ as follows from D: replace any

(^11) For any vertexv,δout(v) =δout({v}) andδin(v) =δin({v}).


56 Chapter 4. Menger’s theorem, flows, and circulations

vertexvby two verticesv′, v′′and make an arc (v′, v′′); moreover, replace each arc
(u, v) by (u′′, v′). Then Corollary 4.1b forD′, s′′, t′gives Corollary 4.1a forD, s, t.
Note that ans′′−t′cutCinD′yields a setXof vertices and arcs inDintersecting
eachs−tpath, with|X|=|C|. Replacing each arc occurring inXby one of its ends
different froms, t, yields ans−tvertex cut inDof size at most|C|.
Similar theorems hold forundirectedgraphs. They can be derived from the di-
rected case by replacing each undirected edgeuwby two opposite arcs (u, w) and
(w, u).

Application 4.1: Routing airplanes. An airline company carries out a certain number
of flights according to some fixed timetable, in a weekly cycle. The timetable is basically
given by a flight numberi(for instance 562), a departure citydci(for instance Vancouver),
a departure timedti(for instance Monday 23.15h), an arrival cityaci(for instance Tokyo),
and an arrival timeati(for instance Tuesday 7.20h). All times include boarding and disem-
barking and preparing the plane for a next flight. Thus a planewith arrival time Tuesday
7.20h at cityc, can be used for any flight fromcwith departure time from Tuesday 7.20h
on.
The flights are carried out bynairplanes of one type, denoted bya 1 ,...,an. At each
weekday there should be an airplane for maintenance at the home basis, from 6.00h till
18.00h. Legal rules prescribe which of the airplanesa 1 ,...,anshould be at the home basis
during one day the coming week, but it is not prescribed whichairplane should be at the
home basis at which day (see Application 9.4 for an extensionwhere thisisprescribed).
The timetable is made in such a way that at each city the numberof incoming flights is
equal to the number of outgoing flights. Here ‘maintenance’ is also considered as a flight.
However, there is flexibility in assigning the airplanes to the flights: if at a certain moment
at a certain city two or more airplanes are available for a flight, in principle any of them
can be used for that flight. Which of the available airplanes will be used, is decided by the
main office of the company. This decision is made at 18.00h on the Saturday before. At
that time the company makes the exact routing of the planes for the coming week.
At that moment, certain planes are performing certain flights, while other planes are
grounded at certain cities. Routing the airplanes is easy asthe timetable is set up in such
a way that at each moment and each city enough airplanes are available.
Indeed, one can make a directed graphD(Figure 4.1) with vertex set all pairs (dci,dti)
and (aci,ati) for all flight numbersi. For each flightithat is not in the air at Saturday
18.00h, one makes an arc from (dci,dti) to (aci,ati). We also do this for the “flights”
representing maintenance.
Moreover, for each citycand each two consecutive timest,t′at which any flight departs
or arrives atc, one makesmparallel arcs from (c,t) to (c,t′), wheremis the number of
airplanes that will be in citycduring the periodt–t′.
In this way we obtain a directed graph such that at each vertexthe indegree is equal
to the outdegree, except at any (c,tc) wheretcis the earliest time after Saturday 18.00h
at which any flight arrives at or leaves cityc. Hence we can find inDarc-disjoint paths
P 1 ,...,Pn(wherenis the number of airplanes) inDsuch that each arc is in exactly one of
thePi. This would give a routing for the airplanes.
However, the restriction that some prescribed airplanes must undergo maintenance the


Section 4.1. Menger’s theorem 57

```
Sat Sun Mon Tue Wed Thu Fri Sat
```
```
maintenance maintenance maintenance maintenance maintenance
```
```
B C D E F G J K L N
```
```
H
I
```
```
M
```
```
A
```
```
Figure 4.1
```
coming week gives some complications. It means for instancethat if a certain airplaneai
(say) is now on the ground at citycand should be home for maintenance the coming week,
then the pathPishould start at (c,tc) and should traverse one of the arcs representing
maintenance. Ifaiis now in the air, then pathPishould start at (c,t) wheretis the
first-coming arrival time ofaiand should traverse a maintenance arc. So the company first
finds arc-disjoint pathsPi 1 ,...,Pik, whereai 1 ,...,aikare the airplanes that should undergo
maintenance the coming week. These paths can be extended to pathsP 1 ,...,Pnsuch that
each arc is traversed exactly once.
So the problem can be solved by finding arc-disjoint paths starting in a given set of
vertices and ending in a given set of vertices (by slightly extending the graphD).

Exercises

```
4.1. LetD= (V,A) be a directed graph and lets,t 1 ,...,tk be vertices of D. Prove
that there exist pairwise arc-disjoint pathsP 1 ,...,Pksuch thatPiis ans−tipath
(i= 1,...,k) if and only if for eachU⊆V withs∈Uone has
```
```
(1) |δout(U)|≥|{i|ti6∈U}|.
```
```
4.2. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be families of subsets of a finite set.
Show thatAandBhave a common SDR if and only if for allI,J⊆ { 1 ,...,n}one
has
```
```
(2)
```
```
∣
∣
```
```
⋃
```
```
i∈I
```
```
Ai∩
```
```
⋃
```
```
j∈J
```
```
Bj
```
```
∣
∣≥|I|+|J|−n.
```

58 Chapter 4. Menger’s theorem, flows, and circulations

```
4.3. LetG= (V,E) be a bipartite graph, with colour classesV 1 andV 2 , such that|V 1 |=
|V 2 |. Show thatGhaskpairwise disjoint perfect matchings if and only if for each
subsetUofV 1 :
```
```
(3)
```
```
∑
```
```
v∈V 2
```
```
min{k,|E(v)∩U|}≥k|U|,
```
```
whereE(v) denotes the set of vertices adjacent tov.
```
```
4.4. LetD= (V,A) be a simple directed graph and lets,t∈V. Letαbe the minimum
length of ans−tpath. Show that the maximum number of pairwise arc-disjonts−t
paths is at most (|V|/α)^2.
(Hint: LetUk denote the set of vertices at distance at mostkfroms. Show that
|δout(Uk)|≤(|V|/α)^2 for somek < α.)
```
### 4.2. Flows in networks

Other consequences of Menger’s theorem concern ‘flows in networks’. LetD= (V, A)
be a directed graph and lets, t ∈V. Throughout we assumes 6 =t. A function
f:A→Ris called ans−tflowif:^12

(4) (i) f(a) ≥ 0 for eacha∈A;

```
(ii)
```
###### ∑

```
a∈δin(v)
```
```
f(a) =
```
###### ∑

```
a∈δout(v)
```
```
f(a) for eachv∈V\{s, t}.
```
Condition (4)(ii) is called theflow conservation law: the amount of flow entering a
vertexv 6 =s, tshould be equal to the amount of flow leavingv.
Thevalueof ans−tflowfis, by definition:

(5) value(f) :=

###### ∑

```
a∈δout(s)
```
```
f(a)−
```
###### ∑

```
a∈δin(s)
```
```
f(a).
```
So the value is the net amount of flow leavings. It can be shown that it is equal to
the net amount of flow enteringt.
Letc:A→R+, called acapacity function. We say that a flowfisunderc(or
subject toc) if

(6) f(a)≤c(a) for eacha∈A.

Themaximum flow problemnow is to find ans−tflow underc, of maximum value.
To formulate a min-max relation, define thecapacityof a cutδout(U) by:

(^12) δout(v) andδin(v) denote the sets of arcs leavingvand enteringv, respectively.


Section 4.2. Flows in networks 59

(7) c(δout(U)) :=

###### ∑

```
a∈δout(U)
```
```
c(a).
```
Then:

Proposition 2.For everys−tflowfundercand everys−tcutδout(U)one has:

(8) value(f)≤c(δout(U)).

Proof.

(9) value(f) =

###### ∑

```
a∈δout(s)
```
```
f(a)−
```
###### ∑

```
a∈δin(s)
```
```
f(a)
```
###### =

###### ∑

```
a∈δout(s)
```
```
f(a)−
```
###### ∑

```
a∈δin(s)
```
```
f(a) +
```
###### ∑

```
v∈U\{s}
```
###### (

###### ∑

```
a∈δout(v)
```
```
f(a)−
```
###### ∑

```
a∈δin(v)
```
```
f(a))
```
###### =

###### ∑

```
v∈U
```
###### (

###### ∑

```
a∈δout(v)
```
```
f(a)−
```
###### ∑

```
a∈δin(v)
```
```
f(a)) =
```
###### ∑

```
a∈δout(U)
```
```
f(a)−
```
###### ∑

```
a∈δin(U)
```
```
f(a)
```
```
⋆
≤
```
###### ∑

```
a∈δout(U)
```
```
f(a)
```
```
⋆⋆
≤
```
###### ∑

```
a∈δout(U)
```
```
c(a) =c(δout(U)).
```
```
It is convenient to note the following:
```
(10) equality holds in (8) ⇐⇒ ∀a∈δin(U) :f(a) = 0 and
∀a∈δout(U) :f(a) =c(a).

This follows directly from the inequalities⋆and⋆⋆in (9).
Now from Menger’s theorem one can derive that equality can be attained in (8),
which is a theorem of Ford and Fulkerson [1956]:

Theorem 4.2 (max-flow min-cut theorem). For any directed graphD = (V, A),
s, t∈V withs 6 =t, andc:A→R+, the maximum value of ans−tflow undercis
equal to the minimum capacity of ans−tcut. In formula:

(11) max
f s-tflow
value(f) = min
δout(U) s-tcut

```
c(δout(U)).
```
Proof.Ifcis integer-valued, the corollary follows from Menger’s theorem (directed
arc-disjoint version — Corollary 4.1b) by replacing each arcabyc(a) parallel arcs.
Ifcis rational-valued, there exists a natural numberN such thatN c(a) is integer
for eacha∈A. Changing eachc(a) toN c(a) multiplies both the maximum and the
minimum byN. So the equality follows from the case wherecis integer-valued.


60 Chapter 4. Menger’s theorem, flows, and circulations

Ifcis real-valued, we can derive the corollary from the case wherecis rational-
valued, by continuity and compactness arguments.

```
Moreover, one has (Dantzig [1951a]):
```
Corollary 4.2a(Integrity theorem). Ifcis integer-valued, there exists an integer-
valued maximum flow.

Proof.Directly from Menger’s theorem.

Exercises

```
4.5. LetD= (V,A) be a directed graph and lets,t∈V. Letf:A→R+be ans−tflow
of valueβ. Show that there exists ans−tflowf′:A→Z+of value⌈β⌉such that
⌊f(a)⌋≤f′(a)≤⌈f(a)⌉for each arca. (Integer flow theorem (Dantzig [1951a]).)
```
```
4.6. LetG= (V,E) be a graph and letc:E→R+be a ‘capacity’ function. LetKbe
the complete graph onV. For each edgestofK, letw(st) be the minimum capacity
of anys−tcut inG. [Ans−tcut is any subsetδ(W) withs∈W,t6∈W.]
LetTbe a spanning tree inKof maximum total weight with respect to the function
w. Prove that for alls,t∈V,w(st) is equal to the minimum weight of the edges of
T in the uniques−tpath inT.
(Hint:Use Exercise 1.10.)
```
### 4.3. Finding a maximum flow

LetD= (V, A) be a directed graph, lets, t∈V, and letc:A→Q+be a ‘capacity’
function. We now describe the algorithm of Ford and Fulkerson [1956] to find ans−t
flow of maximum value underc.
In this section, byflowwe will mean ans−tflow underc, and bycutans−t
cut. Amaximum flowis a flow of maximum value.
We now describe the algorithm of Ford and Fulkerson [1957] todetermine a max-
imum flow. We assume thatc(a)> 0 for each arc a. Moreover, for the sake of
exposition we assume that for no arc (u, v), also (v, u) is an arc. (We can achieve
this by, if necessary, ‘inserting a new vertex on an arc’.) First we give an important
subroutine:

Flow augmenting algorithm

input:a flowf.
output: either (i) a flowf′with value(f′)>value(f),
or (ii) a cutδout(W) withc(δout(W)) = value(f).


```
Section 4.3. Finding a maximum flow 61
```
```
description of the algorithm:For any paira= (v, w) definea−^1 := (w, v). Make
an auxiliary graphDf= (V, Af) by the following rule: for any arca∈A,
```
```
(12) iff(a)< c(a) thena∈Af,
iff(a)>0 thena−^1 ∈Af.
```
```
So if 0< f(a)< c(a) then bothaanda−^1 are arcs ofAf.
Now there are two possibilities:
```
(13) Case 1:There exists ans−tpath inDf,
Case 2:There is nos−tpath inDf.

```
Case 1:There exists ans−tpathP= (v 0 , a 1 , v 1 ,... , ak, vk)inDf= (V, Af).
Sov 0 =sandvk=t. We may assume thatPis a path. Asa 1 ,... , akbelong toAf,
we know by (12) that for eachi= 1,... , k:
```
```
(14) either (i) ai∈Aandσi:=c(ai)−f(ai)> 0
or (ii) a−i^1 ∈Aandσi:=f(a−i^1 )> 0.
```
```
Defineα:= min{σ 1 ,... , σk}. Soα >0. Letf′:A→R+be defined by, fora∈A:
```
```
(15) f′(a) := f(a) +α, ifa=aifor somei= 1,... , k;
:= f(a)−α, ifa=a−i^1 for somei= 1,... , k;
:= f(a), for all othera.
```
```
Thenf′ again is ans−tflow underc. The inequalities 0≤f′(a)≤c(a) hold
because of our choice ofα. It is easy to check that also the flow conservation law
(4)(ii) is maintained.
Moreover,
```
```
(16) value(f′) = value(f) +α,
```
```
since either (v 0 , v 1 )∈A, in which case the outgoing flow insis increased byα, or
(v 1 , v 0 )∈A, in which case the ingoing flow insis decreased byα.
PathPis called aflow augmenting path.
```
```
Case 2:There is no path inDf= (V, Af)fromstot.
Now define:
```
```
(17) U:={u∈V |there exists a path inDffromstou}.
```
```
Thens∈Uwhilet6∈U, and soδout(U) is ans−tcut.
```

62 Chapter 4. Menger’s theorem, flows, and circulations

By definition ofU, ifu∈U andv6∈U, then (u, v)6∈Af (as otherwise alsov
would belong toU). Therefore:

(18) if (u, v)∈δout(U), then (u, v)6∈Af, and so (by (12)):f(u, v) =c(u, v),
if (u, v)∈δin(U), then (v, u)6∈Af, and so (by (12)):f(u, v) = 0.

Then (10) gives:

(19) c(δout(U)) = value(f).

This finishes the description of the flow augmenting algorithm. The description
of the(Ford-Fulkerson) maximum flow algorithmis now simple:

Maximum flow algorithm

input:directed graphD= (V, A), s, t∈V, c:A→R+.
output:a maximum flowfand a cutδout(U) of minimum capacity, with value(f) =
c(δout(U)).
description of the algorithm: Letf 0 be the ‘null flow’ (that is, f 0 (a) = 0 for
each arca). Determine with the flow augmenting algorithm flowsf 1 , f 2 ,... , fNsuch
thatfi+1=fi′, until, in the (N+ 1)-th iteration, say, we obtain output (ii) of the
flow augmenting algorithm. Then we have flowfNand a cutδout(U) with the given
properties.

```
We show that the algorithm terminates, provided that all capacities are rational.
```
Theorem 4.3.If all capacitiesc(a)are rational, the algorithm terminates.

Proof.If all capacities are rational, there exists a natural numberKso thatKc(a)
is an integer for eacha∈A. (We can take forK the l.c.m. of the denominators of
thec(a).)
Then in the flow augmenting iterations, every flowfi(a) and everyαis a multiple
of 1/K. So at each iteration, the flow value increases by at least 1/K. Since the flow
value cannot exceedc(δout(s)), we can have only finitely many iterations.

We should note here that this theorem is not true if we allow general real-valued
capacities.
In Section 4.4 we shall see that if we choose always a shortestpath as flow aug-
menting path, then the algorithm has polynomially bounded running time.
Note that the algorithm also implies the max-flow min-cut theorem (Theorem
4.2). Note moreover that in the maximum flow algorithm, if all capacities are integer,
then the maximum flow will also be integer-valued. So it also implies the integrity
theorem (Corollary 4.2a).


Section 4.3. Finding a maximum flow 63

Application 4.2: Transportation problem. Suppose that there aremfactories, that
all produce the same product, andncustomers that use the product. Each month, factory
ican producesitons of the product. Customerjneeds every monthdjtons of the product.
From factoryito customerjwe can transport every month at mostci,jtons of the product.
The problem is: can the needs of the customers be fulfilled?

```
s t
```
```
1 b
```
```
f 2
```
```
1
```
```
b 4
```
```
f 3
```
```
b 3
```
```
b 5
```
```
b 2
```
```
f
```
```
Figure 4.2
```
In order to solve the problem with the maximum-flow algorithm, we make the graph as
in Figure 4.2 (form= 3,n= 5). We define a capacity functioncon the arcs as follows:

(20) c(s,fi) :=si fori= 1,...,m,
c(fi,bj) :=ci,j fori= 1,...,m;j= 1,...,n,
c(bj,t) :=dj forj= 1,...,n.

Now we have:

(21) the needs of the customers can be fulfilled⇐⇒there is ans−tflow undercwith
valued 1 +···+dn.

Since there cannot exist ans−tflow undercof value larger thand 1 +···+dn(since
c(δin(t)) =d 1 +···+dn), the problem can be solved with the maximum-flow algorithm.
If there exists a flow of valued 1 +···+dn, then the flow on arc (fi,bj) gives the amount
that should be transported each month from factoryito customerj. The flow on arc (s,fi)
gives the amount to be produced each month by factoryfi.

Exercises

```
4.7. Determine with the maximum flow algorithm ans−tflow of maximum value and
ans−tcut of minimum capacity in the following graphs (where the numbers at the
arcs give the capacities):
```

64 Chapter 4. Menger’s theorem, flows, and circulations

```
(i)
```
```
1 11
```
```
5
```
```
2
```
```
5
```
```
1
```
```
2
```
```
4
```
```
2
```
```
7
```
```
4
```
```
10 2 1
```
```
s^22 t
```
```
2
```
```
(ii)
```
```
12
```
```
7
3
```
```
4
```
(^11)
3
1
9
(^111)
2
1
3 2
2 5 3
2
7
5
s t
(iii) s t
3
3
6 9
8
4
5
4
4
1
(^25)
7
1
2
6
(iv) s t
2
2
4
4
5
2
2
10 4
12
1
(^57)
6
2
3
3


Section 4.4. Speeding up the maximum flow algorithm 65

```
4.8. Solve the transportation problem with the maximum-flowalgorithm for the following
data:m=n= 3,s 1 = 13,s 2 = 9,s 3 = 4,d 1 = 3,d 2 = 7,d 3 = 12,
```
```
ci,j j= 1 j= 2 j= 3
i= 1 2 0 8
i= 2 3 8 3
i= 3 0 1 3
```
```
4.9. Describe the problem of finding a maximum-size matchingin a bipartite graph as a
maximum flow problem.
```
```
4.10. Determine with the maximum-flow algorithm if there exists a 3×3 matrixA= (ai,j)
satisfying:^13
```
```
ai,j≥0 for alli,j= 1, 2 ,3;
```
```
A 1 ≤
```
```


```
```
13
9
4
```
```

;
```
```
1 TA= (3, 7 ,12);
```
```
A≤
```
```


```
```
2 0 8
3 8 3
0 1 3
```
```

.
```
```
4.11. Give an example of a directed graph with irrational capacities, in which, at a bad
choice of flow augmenting paths, the maximum flow algorithm does not terminate.
```
```
4.12. LetD= (V,A) be a directed graph, lets,t∈V and letf:A→Q+be ans−tflow
of valueb. Show that for eachU⊆V withs∈U,t6∈Uone has:
```
```
(22)
```
```
∑
```
```
a∈δout(U)
```
```
f(a) −
```
```
∑
```
```
a∈δin(U)
```
```
f(a) =b.
```
### 4.4. Speeding up the maximum flow algorithm

We saw that the number of iterations in the maximum flow algorithm is finite, if all
capacities are rational. If we choose as our flow augmenting pathPin the auxiliary
graphDf anarbitrarys−tpath, the number of iterations yet can get quite large.
For instance, in the graph in Figure 4.3 the number of iterations, at a bad choice of
paths, can become 2· 10 k.

(^131) denotes the vector (1, 1 ,1)T.


66 Chapter 4. Menger’s theorem, flows, and circulations

```
s 1 t
```
```
10 10
```
```
10 10
```
```
k k
```
```
k k
```
```
Figure 4.3
```
However, if we choose always ashortests−tpath inDf as our flow augmenting
pathP(that is, with a minimum number of arcs), then the number of iterations is
at most|V|·|A|. This was shown by Dinits [1970] and Edmonds and Karp [1972].
Again, for any directed graphD = (V, A) and s, t ∈ V, let μ(D) denote the
minimum length of ans−tpath. Moreover, letα(D) denote the set of arcs contained
in at least one shortests−tpath. Then one has:

Proposition 3. LetD= (V, A)ands, t∈V. LetD′ := (V, A∪α(D)−^1 ). Then
μ(D′) =μ(D)andα(D′) =α(D).

Proof.It suffices to show thatμ(D) andα(D) are invariant if we adda−^1 toDfor
one arca∈α(D). Suppose not. Then there is ans−tpathP traversinga−^1 , of
length at mostμ(D). Asa∈α(D), there is ans−tpathQtraversinga, of length
μ(D). HenceAP∪AQ\{a, a−^1 }contains ans−tpath of length less thanμ(D), a
contradiction.

```
This implies the result of Dinits [1970] and Edmonds and Karp[1972]:
```
Theorem 4.4.If we choose in each iteration a shortests−tpath as flow augmenting
path, the number of iterations is at most|V||A|.

Proof.If we augment flowfalong a shortest pathP, obtaining flowf′, thenDf′
is a subgraph of D′ := (V, Af∪α(Df)−^1 ). Henceμ(Df′) ≥ μ(D′) =μ(Df) (by
Proposition 3). Moreover, ifμ(Df′) =μ(Df), thenα(Df′)⊆α(D′) =α(Df) (again
by Proposition 3). As at least one arc inPbelongs toDfbut not toDf′, we have a
strict inclusion.

So throughout the iterations, (μ(Df),−|α(Df)|) strictly increases lexicographi-
cally. Sinceμ(Df)<|V|and|α(Df)|≤|A|for eachf, the number of iterations is at
most|V||A|.

```
Since a shortest path can be found in timeO(|A|), this gives:
```
Corollary 4.4a. The maximum flow problem can be solved in timeO(|V||A|^2 ).


Section 4.4. Speeding up the maximum flow algorithm 67

Proof.Directly from Theorem 4.4.

This algorithm can be improved, as was shown by Karzanov [1974]. In each
iteration we find a shortest path inO(|A|) time. But as long as the distance froms
totdoes not increase, we could use the data-structure of the previous shortest path
search so as to find the next shortest path.

This can be described as follows. Call ans−tflowfblockingif for eachs−t
flowg≥fone hasg=f. Now Karzanov [1974] showed the following (we give the
short proof of Malhotra, Kumar, and Maheshwari [1978]; see also Tarjan [1984]):

Theorem 4.5. Given an acyclic directed graphD= (V, A),s, t∈V, and a capacity
functionc:A→Q+, a blocking flow can be found in timeO(|V|^2 ).

Proof.First order the vertices reachable fromsass=v 1 , v 2 ,... , vn− 1 , vn topologi-
cally; that is, if (vi, vj)∈Atheni < j. This can be done in timeO(|A|).^14
We describe the procedure recursively. Consider the minimum of the values
c(δin(v)) for allv∈ V\{s}andc(δout(v)) for allv∈V \{t}. Let the minimum
be attained byviandc(δout(vi)) (without loss of generality). Definef(a) :=c(a) for
eacha∈δout(vi) andf(a) := 0 for all othera.
Next forj=i+1,... , n−1, redefinef(a) for eacha∈δout(vj) so thatf(a)≤c(a)
and so thatf(δout(vj)) =f(δin(vj)). By the minimality ofviandc(δin(v)), we can
always do this, as initiallyf(δin(vj))≤c(δout(vi))≤c(δin(vj)). We do this in such a
way that finallyf(a)∈{ 0 , c(a)}for all but at most oneainδout(vj).
After that, forj=i, i− 1 ,... ,2, redefine similarlyf(a) fora∈δin(vj) so that
f(a)≤c(a) and so thatf(δin(vj)) =f(δout(vj)).

Ifvi∈{s, t}we stop, andfis a blocking flow.
Ifvi6∈ {s, t}, setc′(a) :=c(a)−f(a) for eacha∈A, and delete all arcsawith
c′(a) = 0 and deleteviand all arcs incident withvi, thus obtaining the directed graph
D′= (V′, A′). Obtain (recursively) a blocking flowf′inD′ subject to the capacity
functionc′. Definef′′(a) :=f(a) +f′(a) fora∈A′andf′′(a) =f(a) fora∈A\A′.
Thenf′′is a blocking flow inD.
This describes the algorithm. The correctness can be seen asfollows. Ifvi∈{s, t}
the correctness is immediate. Ifvi6∈ {s, t}, supposef′′is not a blocking flow inD,
and letP be ans−tpath inDsuch thatf′′(a)< c(a) for each arcainP. Then
each arc ofPbelongs toA′, sincef′′(a) =f(a) =c(a) for eacha∈A\(A′∪δin(vi)).
So for each arcaof P one hasc′(a) =c(a)−f(a)> f′′(a)−f(a) =f′(a). This
contradicts the fact thatf′is a blocking flow inD′.
The running time of the algorithm isO(|V|^2 ), since the running time of the iter-

(^14) This can be done recursively as follows (cf. Knuth [1968], Tarjan [1974]). Ifδout(s) =∅, then
the ordering is trivial. Ifδout(s) 6 =∅, choose (s,v)∈δout(s), and order the vertices reachable fromv
topologically, asw 1 ,...,wm, delete them fromD, and order the remaining vertices reachable from
stopologically asv 1 ,...,vk; thenv 1 ,...,vk,w 1 ,...,wmgives a required topological ordering.


68 Chapter 4. Menger’s theorem, flows, and circulations

ation isO(|V|+|A\A′|), and since there are at most|V|iterations. (Note that we
determine the topological ordering only once, at the preprocessing.)

```
Theorem 4.5 has the following consequence:
```
Corollary 4.5a.Given a directed graphD= (V, A),s, t∈V, and a capacity function
c:A→Q, a flowf satisfyingμ(Df)> μ(D)can be found in timeO(|V|^2 ).

Proof.LetD ̃ be the subgraph ofDconsisting of all arcs that are contained in a
shortest s−t path inD. Find a blocking flow inD ̃. Thenμ(Df)> μ(D) (by
Proposition 3).

```
Hence we have:
```
Corollary 4.5b.Given a directed graphD= (V, A),s, t∈V, and a capacity function
c:A→Q, a maximums−tflow can be found in timeO(|V|^3 ).

Proof.Directly from the foregoing.

Goldberg and Tarjan [1990] gave anO(|A|log(|V|^2 /|A|)) algorithm for finding
a blocking flow in an acyclic directed graph, implying an O(|V||A|log(|V|^2 /|A|))
algorithm for finding a maximum flow in any directed graph. An alternative approach
finding a maximum flow in timeO(|V||A|log(|V|^2 /|A|)) was described in Goldberg
and Tarjan [1988].

For surveys on maximum flow algorithms, see Goldberg, Tardos, and Tarjan [1990]
and Ahuja, Magnanti, and Orlin [1993].

### 4.5. Circulations

A theorem related to the max-flow min-cut theorem is due to Hoffman [1960] and
concerns circulations. LetD= (V, A) be a directed graph. A functionf:A→Ris
called acirculationif for each vertexv∈V one has:

###### (23)

###### ∑

```
a∈δin(v)
```
```
f(a) =
```
###### ∑

```
a∈δout(v)
```
```
f(a).
```
So now the flow conservation law holds ateachvertexv.

Hoffman [1960] proved the following theorem (which can also bederived from the
max-flow min-cut theorem, but a direct proof seems shorter).For any directed graph
D= (V, A), and anyd, c, f :A→Rwithd(a)≤f(a)≤c(a) for eacha∈A, we
define


Section 4.5. Circulations 69

(24) Af:={a|f(a)< c(a)}∪{a−^1 |d(a)< f(a)},

andDf:= (V, Af).

Theorem 4.6(Hoffman’s circulation theorem). LetD= (V, A)be a directed graph
and letd, c:A→Rbe such that d(a)≤c(a)for each arc a. Then there exists a
circulationf such that

(25) d(a)≤f(a)≤c(a)

for each arcaif and only if

###### (26)

###### ∑

```
a∈δin(U)
```
```
d(a)≤
```
###### ∑

```
a∈δout(U)
```
```
c(a)
```
for each subsetUofV.

Proof.To see necessity of (26), suppose that a circulationfsatisfying (25) exists.
Then^15

(27) d(δin(U))≤f(δin(U)) =f(δout(U))≤c(δout(U)).

```
To see sufficiency, define for anyf:A→Rand anyv∈V,
```
(28) lossf(v) :=f(δout(v))−f(δin(v)).

So lossfcan be seen as a vector inRV.
Choose a functionfsatisfyingd≤f≤cand minimizing‖lossf‖ 1. Let

(29) S:={v∈V |lossf(v)< 0 }andT:={v∈V|lossf(v)> 0 }.

IfS=∅, thenfis a circulation, and we are done. So assumeS 6 =∅. IfDfcontains
anS−T path, we can modifyfso as to reduce‖lossf‖ 1. SoDfdoes not contain
anyS−Tpath. LetUbe the set of vertices reachable inDf fromS. Then for each
a∈δout(U) we havea6∈Af and hencef(a) =c(a). Similarly, for eacha∈δin(U) we
havea−^1 6∈Af and hencef(a) =d(a). Therefore

(30) c(δout(U))−d(δin(U)) =f(δout(U))−f(δin(U)) = lossf(U) = lossf(S)< 0 ,

contradicting (26).

(^15) For any functiong:A→Rand subsetBofA, we writeg(B) =∑a∈Bg(a).


70 Chapter 4. Menger’s theorem, flows, and circulations

```
One has moreover:
```
Theorem 4.7. In Theorem4.6, ifcanddare integer and there exists a circulation
f satisfyingd≤f ≤c, then there exists an integer-valued circulationf′ satisfying
d≤f′≤c.

Proof.Directly from the proof above.

Exercises

```
4.13. LetD= (V,A) be a directed graph and letf:A→Rbe a circulation. Show that
there exists a circulationf′such thatf′ is integer-valued and such that⌊f(a)⌋ ≤
f′(a)≤⌈f(a)⌉for each arca.
```
```
4.14. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be partitions of a finite setXand letk
be a natural number. Prove thatXcan be covered bykcommon SDR’s ofAandB
if and only if
```
```
(31)
```
```
∣∣
(
```
```
⋃
```
```
i∈I
```
```
Ai∪
```
```
⋃
```
```
j∈J
```
```
Bj)
```
```
∣∣
≥|X|+k(|I|+|J|−n)
```
```
for allI,J⊆{ 1 ,...,n}with
```
```
⋃
i∈IAi∩
```
```
⋃
j∈JBj=∅.
4.15. LetD= (V,A) be a directed graph, and letf :A→R+. LetCbe the collection
of directed circuits inD. For each directed circuitCinDletχCbe the incidence
vector ofC. That is,χC:A→{ 0 , 1 }, withχC(a) = 1 ifCtraversesaandχC(a) = 0
otherwise.
Show thatfis a nonnegative circulation if and only if there exists a functionλ:C →
R+such that
```
```
(32) f=
```
```
∑
```
```
C∈C
```
```
λ(C)χC.
```
```
That is, the nonnegative circulations form the cone generated by{χC|C∈C}.
```
### 4.6. Minimum-cost flows

In the previous sections we were searching for flows of maximum value. In this section
we consider the problem of finding a flow of maximum value with the additional
property that it has ‘minimum cost’.
Let be given again a directed graphD= (V, A), distinct verticessandtofD,
and a capacity functionc:A→R+. Let moreover be given a functionk:A→R+,


```
Section 4.6. Minimum-cost flows 71
```
```
called thecost function. Again we assume thatc(a)>0 for eacha, and that for no
u, v∈V, both (u, v) and (v, u) occur as arc ofD.
Define for any functionf:A→R+thecostoffas:
```
```
(33) cost(f) :=
```
###### ∑

```
a∈A
```
```
k(a)f(a).
```
```
The following is theminimum-cost flow problem(ormin-cost flow problem):
```
(34) given: a directed graphD= (V, A),s, t∈V, a capacity functionc:A→R+
and a cost functionk:A→R+;
find: ans−tflow subject tocof maximum value, such thatfhas minimum
cost among alls−tflows subject tocof maximum value.

```
This problem can be solved with an adaptation of the algorithm described in
Section 4.3. Let us define ans−tflowf≤cto be anextreme flowiffhas minimum
cost among alls−tflowsg≤cwith value(g) = value(f).
So an extreme flow does not need to have maximum value. An extreme flow is a
flowfthat has minimum cost among all flows with the same value asf.
Define a length functionl:A∪A−^1 →Rby:
```
```
(35) l(a) :=
```
###### {

```
k(a) ifa∈A,
−k(a−^1 ) ifa−^1 ∈A
```
```
for eacha∈A∪A−^1. For any directed path or circuitPinA∪A−^1 , letl(P) be the
sum ofl(a) over arcsainP.
For any flowf, let againDf= (V, Af) be the auxiliary graph corresponding tof
(in the sense of the flow augmenting algorithm).
```
```
Proposition 4.fis an extreme flow if and only ifDfhas no directed circuitCwith
l(C)< 0.
```
```
Proof.Necessity.Suppose thatC= (a 1 ,... , ak) is a directed circuit inDfof negative
length; that is,
```
```
(36) l(C) =l(a 1 ) +l(a 2 ) +···+l(ak)< 0.
```
```
Soa 1 ,... , akare arcs inDf. Define fori= 1,... , k:
```
```
(37) σi:=
```
###### {

```
c(ai)−f(ai) ifai∈A,
f(a−i^1 ) ifa−i^1 ∈A.
```

72 Chapter 4. Menger’s theorem, flows, and circulations

Note that by definition ofDf,σi>0 for eachi= 1,... , k. Letα:= min{σ 1 ,... , σk}
and define for eacha∈A:

(38) g(a) :=

###### 

###### 

###### 

```
f(a) +α ifa∈C,
f(a)−α ifa−^1 ∈C,
f(a) otherwise.
```
Thengis again ans−tflow subject toc, with value(g) = value(f). Moreover one
has

(39) cost(g) = cost(f) +α·l(C)<cost(f).

Sofis not an extreme flow.

Sufficiency.Letgbe any flow with value(g) =value(f). Defineh:Af→R+by:

(40) h(a) :=g(a)−f(a) ifg(a)> f(a), and
h(a−^1 ) :=f(a)−g(a) ifg(a)< f(a),

fora∈A, whileh(a) = 0 for all other arcsaofAf. Thenhis a circulation inDf.

∑Hence, by Exercise 4.15, there exists a functionλ : C → R+ such thath =
C∈Cλ(C)χ

C. Hence cost(g)−cost(f) = ∑
C∈Cλ(C)l(C). Assuming Df has no
directed circuits of negative length, it follows that cost(g)≥ cost(f). Sof is an
extreme flow.

```
With this we can show:
```
Proposition 5. Letf be an extreme flow. Let f′ arise by choosing in the flow
augmenting algorithm a pathPinDf minimizingl(P). Thenf′is an extreme flow
again.

Proof.IfDf′has a directed circuitCwithl(C)<0, we could have chosen a shorter
s−tpath inDf. To see this, letA(P) andA(C) be the sets of arcs inP andC,
respectively. ThenA(C)⊆Af′⊆Af∪A(P)−^1. Hence forB:=A(C)∩A(P)−^1 , the
set (A(P)\B−^1 )∪(A(C)\B) is a subset ofAf. Moreover, it can be decomposed
into a directeds−tpathQand a number of directed circuitsC 1 ,... , Ck, counting
multiplicities: if an arc occurs both inA(P) andA(C), then it occurs twice in this
decomposition. (This decomposition exists since adding arc (t, s) makes (V,(A(P)\
B−^1 )∪(A(C)\B)) Eulerian.)

Sincel(Ci)≥0 for eachi(asCiis a directed circuit inAfandfis extreme), and
sincel(B−^1 ) =−l(B), we have


Section 4.6. Minimum-cost flows 73

(41) l(P)> l(P)+l(C) =l(P)−l(B−^1 )+l(C)−l(B) =l(Q)+

```
∑k
```
```
i=1
```
```
l(Ci)≥l(Q).
```
This contradicts the fact thatPis shortest inDf.

This implies that the min-cost flow problem can be solved by choosing in the flow
augmenting algorithm a shortest path in the auxiliary graphthroughout. The first
flow, the all-zero flow f 0 , is trivially an extreme flow. Hence also all further flows
f 1 , f 2 , f 3 ,.. .will be extreme flows by Proposition 5. Therefore, also the last flow,
which is of maximum value, is an extreme flow. So we have a solution to the min-cost
flow problem. (Here we assume that all capacities are rational.)

In this process, we should be able to find a shortests−tpath in the auxiliary
graphsDf. This is indeed possible with the Bellman-Ford method, sinceDfdoes not
have directed circuits of negative length as we saw in Proposition 4.

The algorithm can be modified so that all lengths are nonnegative throughout
the iterations, and this yields a running time of O(M·(m+nlogn)), whereM is
the value of a maximum flow (assuming all capacities to be integer). This is not
polynomial-time. Tardos [1985] gave the first polynomial-time algorithm to find a
minimum-cost flow of maximum value. At the moment of writing,the asymptotically
fastest method was given by Orlin [1988,1993] and runs inO(mlogn(m+nlogn))
time.

In a similar way one can describe aminimum-cost circulationalgorithm. For more
about network flows we refer to the books of Ford and Fulkerson[1962] and Ahuja,
Magnanti, and Orlin [1993].

Application 4.3: Minimum-cost transportation problem. Beside the data in Appli-
cation 4.2 one may also have a cost functionki,j, giving the cost of transporting 1 ton from
factoryito costumerj. Moreover, there is given a costkiof producing 1 ton by factory
i(for eachi). We want to make a production and transportation plan that minimizes the
total cost.

This problem can be solved by assigning also costs to the arcsin Application 4.2. We
can take the costs on the arcs frombjtotequal to 0.

Application 4.4: Routing empty freighters. Historically, in his paper “Optimum
utilization of the transportation system”, Koopmans [1948] was one of the first studying
the minimum-cost transportation problem, in particular with application to the problem of
routing empty freighters. Koopmans considered the surplusand need of register ton of ship
capacity at harbours all over the world, as given by the following table (data are aggregated
to main harbours):


74 Chapter 4. Menger’s theorem, flows, and circulations

```
Net receipt of dry cargo in overseas trade, 1925
Unit: Millions of metric tons per annum
Harbour Received Dispatched Net receipts
New York 23.5 32.7 −9.2
San Francisco 7.2 9.7 −2.5
St. Thomas 10.3 11.5 −1.2
Buenos Aires 7.0 9.6 −2.6
Antofagasta 1.4 4.6 −3.2
Rotterdam 126.4 130.5 −4.1
Lisbon 37.5 17.0 20.5
Athens 28.3 14.4 13.9
Odessa 0.5 4.7 −4.2
Lagos 2.0 2.4 −0.4
Durban 2.1 4.3 −2.2
Bombay 5.0 8.9 −3.9
Singapore 3.6 6.8 −3.2
Yokohama 9.2 3.0 6.2
Sydney 2.8 6.7 −3.9
Total 266.8 266.8 0.0
```
Given is moreover a distance table between these harbours. Koopmans wondered how
ships should be routed between harbours so as to minimize thetotal amount of ton kilome-
ters made by empty ships.
This problem is a special case of the min-cost flow problem. Make a graph with vertex
set all harbours, together with two dummy harbourssandt. From any harbouruwith
a surplus (positive net receipt) to any harbourwwith a need (negative net receipt) make
an arc with cost equal to the distance betweenuandw, and with capacity∞. Moreover,
fromsto any harbouruwith a surplusσ, make an arc with cost 0 and capacity equal to
σ. Similarly, from any harbourwwith a needν, make an arc tot, with cost 0 and capacity
equal toν.
Now a maximum flow of minimum cost corresponds to an optimum routing of ships
between harbours.
A similar model applies to the problem of routing empty box cars in a railway network
(Feeney [1957], cf. Norman and Dowling [1968], White and Bomberault [1969]).

Application 4.5: Routing of railway stock. NS (Nederlandse Spoorwegen = Dutch
Railways) performs a daily schedule on its line Amsterdam–Vlissingen, with the following
(weekday) timetable:

```
ride number 2123212721312135213921432147 215121552159216321672171 21752179218321872191
Amsterdam d 6.48 7.55 8.56 9.5610.5611.5612.5613.5614.5615.5616.5617.5618.5619.5620.5621.5622.56
Rotterdam a 7.55 8.58 9.5810.5811.5812.5813.5814.5815.5816.5817.5818.5819.5820.5821.5822.5823.58
Rotterdam d7.008.01 9.0210.0311.0212.0313.0214.0215.0216.0017.0118.0119.0220.0221.0222.0223.02
Roosendaal a7.408.41 9.4110.4311.4112.4113.4114.4115.4116.4317.4318.4219.4120.4121.4122.4123.54
Roosendaal d7.438.43 9.4310.4511.4312.4313.4314.4315.4316.4517.4518.4419.4320.4321.43
Vlissingen a8.389.3810.3811.3812.3813.3814.3815.3816.3817.4018.4019.3920.3821.3822.38
ride number 2108211221162120212421282132 213621402144214821522156 21602164216821722176
Vlissingen d 5.30 6.54 7.56 8.56 9.5610.5611.5612.5613.5614.5615.5616.5617.5618.5619.55
Roosendaal a 6.35 7.48 8.50 9.5010.5011.5012.5013.5014.5015.5016.5017.5018.5019.5020.49
Roosendaal d 5.29 6.43 7.52 8.53 9.5310.5311.5312.5313.5314.5315.5316.5317.5318.5319.5320.5221.53
Rotterdam a 6.28 7.26 8.32 9.3210.3211.3212.3213.3214.3215.3216.3217.3318.3219.3220.3221.3022.32
Rotterdam d5.316.29 7.32 8.35 9.3410.3411.3412.3413.3514.3515.3416.3417.3518.3419.3420.3521.3222.34
Amsterdam a6.397.38 8.38 9.4010.3811.3812.3813.3814.3815.3816.4017.3818.3819.3820.3821.3822.3823.38
```

Section 4.6. Minimum-cost flows 75

The rides are carried out by one type of stock, that consists of two-way units that can
be coupled with each other. The length of the trains can be changed at the end stations
and at two intermediate stations: Rotterdam and Roosendaal. So in this example, each
train ride consists of three ride ‘segments’.
Based on the expected number of passengers, NS determines for each ride segment a
minimum number of units that should be deployed for that segment:

```
ride number 212321272131213521392143214721512155215921632167217121752179218321872191
Amsterdam-Rotterdam 3 5 4 3 3 3 3 3 3 4 5 5 3 2 2 2 1
Rotterdam-Roosendaal 2 3 4 4 2 3 3 3 3 4 5 5 4 2 2 2 1
Roosendaal-Vlissingen 3 2 2 2 2 3 2 3 3 3 4 4 3 2 1
ride number 210821122116212021242128213221362140214421482152215621602164216821722176
Vlissingen-Roosendaal 2 4 4 4 2 2 3 2 2 2 3 3 2 2 2
Roosendaal-Rotterdam 2 4 5 4 5 3 3 3 2 3 3 4 3 2 2 2 2
Rotterdam-Amsterdam 1 3 5 4 4 5 3 3 3 3 3 4 5 3 2 2 2 2
```
```
17
```
```
19
```
```
20
```
```
22
```
```
24
1
```
```
10
```
```
6
```
```
7
```
```
8
```
```
9
```
```
11 12 13
14
```
```
15
```
```
16
```
```
18
```
```
21
```
```
23
```
```
2
```
```
3
```
```
4
```
```
5
```
```
Roosendaal
```
```
Amsterdam
```
```
Vlissingen
```
```
Rotterdam
```
```
Figure 4.4
```
A unit uncoupled from a train at a station can be coupled at anyother later train, in
the same direction or the other. Moreover, for each segment there is a maximum number


76 Chapter 4. Menger’s theorem, flows, and circulations

of units given that can be used for that segment (depending for instance on the length of
station platforms).

The company now wishes to find the minimum number of units thatshould be used to
run the schedule (excluding maintenance).

As was observed by Bartlett [1957] (cf. van Rees [1965]) thisproblem can be considered
as a minimum-cost circulation problem (cf. Figure 4.4). Make a directed graphDwith
vertex set all pairs (s,t) wheresis any station where the train composition can be changed
(in our example: the end stations and the two intermediate stations) andtis any time at
which there is a train arriving at or leavings. For each ride segment make an arc from (s,t)
to (s′,t′) if the segment leavessat timetand arrives ats′at timet′.

Moreover, for each stationsand each two consecutive timest,t′ at which segments
arrive or leave, one makes an arc from (s,t) to (s,t′). One also does this overnight.

Now for each arcacoming from a segment assign a lower boundd(a) equal to the
number given in the table above for the segment. Moreover, define an upper boundc(a)
equal to the maximum number of units that can be used for that segment. For each arca
from (s,t) to (s,t′) letd(a) := 0 andc(a) :=∞.

For each arcadefine a costk(a) := 0, except ifacorresponds to an overnight stay at
one of cities, whenk(a) := 1. Then a minimum-cost circulation corresponds to a routing of
the stock using a minimum number of units.

There are several variations possible. Instead of an upper boundc(a) =∞for the arcsa
from (c,t) to (s,t′) one can takec(a) equal to the capacity of the storage area ats. Instead
of a costk(a) = 0 at each segment one can takek(a) equal to the cost of riding one unit of
stock over that segment. This can be weighed against the costof buying extra units.

```
A similar model for routing airplanes was considered by Ferguson and Dantzig [1955].
```
Exercises

```
4.16. Determine in the following networks a maximums−tflow of minimum-cost (costin
italics,capacityinbold):
```
```
(i) s t
```
```
5
```
```
3
```
```
1
```
```
2
```
```
3
```
```
2
```
```
5
```
```
6
```
```
7
```
```
8
```
```
3
```
```
5
```
```
22
```
```
6
```
```
5
```
```
10
```
```
18
```
```
4
```
```
4
```
```
7
```

Section 4.6. Minimum-cost flows 77

```
(ii) s t
```
```
3
```
```
8
```
```
9
```
```
7 3 1
```
```
7
```
```
2
```
```
4
5
```
```
3
```
```
1
```
```
4
1
```
```
2
```
```
2
```
```
20
```
```
6
```
```
2 3 2 3 3 6
```
```
40
```
```
2
```
```
1 1
```
```
30
```
```
5
```
```
(iii) s t
```
```
2
```
```
4
```
```
1
```
```
1
```
```
3
```
(^41)
3
8
1
5
3 2 4
7 8
3
8
6
1 1
5 2 7 6 8 1
1
1
9
2
8
2
7
4.17. Solve the minimum-cost transportation problem for the following data sets:
(i)m=n= 3,s 1 = 9,s 2 = 15,s 3 = 7,d 1 = 5,d 2 = 13,d 3 = 7,k 1 = 2,k 2 = 3,k 3 =
2,
ci,j j= 1 j= 2 j= 3
i= 1 6 4 0
i= 2 3 9 4
i= 3 0 2 6
ki,j j= 1 j= 2 j= 3
i= 1 8 3 5
i= 2 2 7 1
i= 3 2 5 9
(ii)m=n= 3,s 1 = 11,s 2 = 7,s 3 = 6,d 1 = 9,d 2 = 7,d 3 = 5,k 1 = 4,k 2 = 3,k 3 = 3,
ci,j j= 1 j= 2 j= 3
i= 1 7 4 0
i= 2 3 3 2
i= 3 0 2 4
ki,j j= 1 j= 2 j= 3
i= 1 3 2 4
i= 2 2 8 4
i= 3 1 3 2
4.18. Describe the problem of finding a maximum-weight matching in a bipartite graph as
a minimum-cost flow problem.
4.19. Reduce the problem of finding an extreme flow of given value, to the min-cost flow
problem as described above.


78 Chapter 5. Nonbipartite matching

## 5. Nonbipartite matching

### 5.1. Tutte’s 1-factor theorem and the Tutte-Berge formula

A basic result on matchings in arbitrary (not necessarily bipartite) graphs was found
by Tutte [1947]. It characterizes graphs that have a perfect matching. Aperfect
matching(or a 1−factor) is a matchingM that covers all vertices of the graph. (So
Mpartitions the vertex set ofG.)
Berge [1958] observed that Tutte’s theorem implies a min-max formula for the
maximum size of a matching in a graph, the Tutte-Berge formula, which we prove
first.
Call a component of a graphoddif it has an odd number of vertices. For any
graphG, define

(1) o(G) := number of odd components ofG.

Letν(G) denotes the maximum size of a matching. For any graphG= (V, E) and
U⊆V, the graph obtained by deleting all vertices inUand all edges incident with
U, is denoted byG−U.
Then:

Theorem 5.1(Tutte-Berge formula).For each graphG= (V, E),

(2) ν(G) = min
U⊆V

```
1
2 (|V|+|U|−o(G−U)).
```
Proof.To see≤, we have for eachU⊆V:

(3) ν(G)≤|U|+ν(G−U)≤|U|+^12 (|V\U|−o(G−U)) =^12 (|V|+|U|−o(G−U)).

We prove the reverse inequality by induction on|V|, the caseV =∅being trivial.
We can assume thatGis connected, since otherwise we can apply induction to the
components ofG.
First assume that there exists a vertexvcovered by all maximum-size matchings.
Thenν(G−v) =ν(G)−1, and by induction there exists a subsetU′ofV\{v}with

(4) ν(G−v) =^12 (|V\{v}|+|U′|−o(G−v−U′)).

ThenU:=U′∪{v}gives equality in (2), since


Section 5.1. Tutte’s 1-factor theorem and the Tutte-Berge formula 79

(5) ν(G) =ν(G−v) + 1 =^12 (|V\{v}|+|U′|−o(G−v−U′)) + 1
=^12 (|V|+|U|−o(G−U)).

So we can assume that there is no suchv. In particular,ν(G)<^12 |V|. We show
that there exists a matching of size^12 (|V|−1), which implies the theorem (taking
U:=∅).
Indeed, suppose to the contrary that each maximum-size matchingMmisses at
least two distinct verticesuandv. Among all suchM, u, v, choose them such that
the distance dist(u, v) ofuandvinGis as small as possible.
If dist(u, v) = 1, thenuandvare adjacent, and hence we can augmentMby the
edgeuv, contradicting the maximality of|M|. So dist(u, v)≥2, and hence we can
choose an intermediate vertexton a shortestu−vpath. By assumption, there exists
a maximum-size matchingNmissingt. Choose such anN with|M∩N|maximal.
By the minimality of dist(u, v),Ncovers bothuandv. Hence, asMandNcover
the same number of vertices, there exists a vertexx 6 =tcovered byM but not byN.
Letx∈e=xy∈M. Thenyis covered by some edgef∈N, since otherwiseN∪{e}
would be a matching larger thanN. ReplacingNby (N\{f})∪{e}would increase
its intersection withM, contradicting the choice ofN.

(This proof is based on the proof of Lov ́asz [1979] of Edmonds’ matching polytope
theorem.)
The Tutte-Berge formula immediately implies Tutte’s 1-factor theorem.

Corollary 5.1a(Tutte’s 1-factor theorem).A graphG= (V, E)has a perfect match-
ing if and only ifG−Uhas at most|U|odd components, for eachU⊆V.

Proof.Directly from the Tutte-Berge formula (Theorem 5.1), sinceGhas a perfect
matching if and only ifν(G)≥^12 |V|.

In the following sections we will show how to find a maximum-size matching
algorithmically.
With Gallai’s theorem, the Tutte-Berge formula implies a formula for the edge
cover numberρ(G), whereo(U) denotes the number of odd components of the sub-
graphG[U] ofGinduced byU(meaning thatG[U] = (U,{e∈E|e⊆U})):

Corollary 5.1b. LetG= (V, E)be a graph without isolated vertices. Then

(6) ρ(G) = max
U⊆V

```
|U|+o(U)
2
```
###### .

Proof.By Gallai’s theorem (Theorem 3.1) and the Tutte-Berge formula (Theorem
5.1),


80 Chapter 5. Nonbipartite matching

(7) ρ(G) =|V|−ν(G) =|V|−min
W⊆V

```
|V|+|W|−o(V \W)
2
```
```
= max
U⊆V
```
```
|U|+o(U)
2
```
###### .

Exercises

```
5.1. (i) Show that a tree has at most one perfect matching.
(ii) Show (not using Tutte’s 1-factor theorem) that a treeG= (V,E) has a perfect
matching if and only if the subgraphG−vhas exactly one odd component, for
eachv∈V.
```
```
5.2. LetGbe a 3-regular graph without any bridge. Show thatGhas a perfect matching.
(Abridgeis an edgeenot contained in any circuit; equivalently, deletingeincreases
the number of components; equivalently,{e}is a cut.)
```
```
5.3. LetA 1 ,...,Anbe a collection of nonempty subsets of the finite setXso that each
element inXis in exactly two sets amongA 1 ,...,An. Show that there exists a set
Y intersecting all setsA 1 ,...,An, and satisfying|Y|≤tif and only if for each subset
Iof{ 1 ,...,n}the number of components of (Ai|i∈I) containing an odd number
of sets in (Ai|i∈I) is at most 2t−|I|.
(Here a subsetYofXis called acomponentof (Ai|i∈I) if it is a minimal nonempty
subset ofXwith the property that for eachi∈I:Ai∩Y =∅orAi⊆Y.)
```
```
5.4. LetG= (V,E) be a graph and letT be a subset ofV. ThenGhas a matching
coveringT if and only if the number of odd components ofG−Wcontained inT is
at most|W|, for eachW⊆V.
```
```
5.5. LetG= (V,E) be a graph and letb:V →Z+. Show that there exists a function
f:E→Z+so that for eachv∈V:
```
```
(8)
```
```
∑
```
```
e∈E,v∈e
```
```
f(e) =b(v)
```
```
if and only if for each subsetW ofV the numberβ(W) is at mostb(V\W).
(Here for any subsetW ofV,b(W) :=
```
```
∑
v∈Wb(v). Moreover,β(W) denotes the
following. LetUbe the set of isolated vertices in the graphG|Winduced byWand
lettdenote the number of componentsCof the graphG|W\Uwithb(C) odd. Then
β(W) :=b(U) +t.)
```
```
5.6. LetG= (V,E) be a graph and let b:V →Z+. Show thatGhas a subgraph
G′= (V,E′) such that degG′(v) =b(v) for eachv ∈V if and only if for each two
disjoint subsetsUandW ofV one has
```
```
(9)
```
```
∑
```
```
v∈U
```
```
b(v)≥q(U,W) +
```
```
∑
```
```
v∈W
```
```
(b(v)−dG−U(v)).
```

Section 5.2. Cardinality matching algorithm 81

```
Hereq(U,W) denotes the number of componentsKofG−(U∪W) for whichb(K)
plus the number of edges connectingK andW, is odd. Moreover,dG−U(v) is the
degree ofvin the subgraph induced byV\U.
```
### 5.2. Cardinality matching algorithm

We now investigate the problem of finding a maximum-cardinality matching algorith-
mically. Like in the bipartite case, the key is to find an augmenting path. However,
the idea for bipartite graphs to orient the edges using the two colour classes, does not
apply to nonbipartite graphs.
Yet one could try to find an M-augmenting path by finding a so-called M-
alternating walk, but such a path can run into a loop that cannot immediately be
deleted. It was J. Edmonds who found the trick to resolve this problem, namely
by ‘shrinking’ the loop (which he called a ‘blossom’). Then applying recursion to a
smaller graph solves the problem.

We first describe the operation ofshrinking. LetXandYbe sets. Then we define
X/Y as follows:

(10) X/Y :=XifX∩Y =∅,
X/Y := (X\Y)∪{Y}ifX∩Y 6 =∅.

So if G= (V, E) is a graph andC ⊆V, thenV /C arises fromV by deleting all
vertices inC, and adding one new vertex calledC. For any edgeeofG,e/C=eif
eis disjoint fromC, whilee/C=uCife=uvwithu6∈C,v∈C. (Ife=uvwith
u, v∈C, thene/Cis a loopCC; they can be neglected in the context of matchings.)
Then for anyF⊆E:

(11) F/C:={f /C|f∈F}.

SoG/C:= (V /C, E/C) is again a graph. We say thatG/Carises fromGbyshrinking
C.

LetG= (V, E) be a graph and letMbe a matching inG, and letWbe the set of
vertices missed byM. A walkP= (v 0 , v 1 ,... , vt) is calledM-alternatingif for each
i= 1,... , t−1 exactly one ofvi− 1 viandvivi+1belongs toM. Note that one can find
a shortestM-alternatingW−Wwalk of positive length, by considering the auxiliary
directed graphD= (V, A) with

(12) A:={(w, w′)|∃x∈V:{w, x}∈E,{x, w′}∈M}.

ThenM-alternatingW−W walks correspond to directed walks inDfrom a vertex
inW to a vertex that is adjacent to at least one vertex inW.


```
82 Chapter 5. Nonbipartite matching
```
```
So anM-augmenting path is anM-alternatingW−W walk of positive length,
in which all vertices are distinct. By Theorem 3.2, a matchingMhas maximum size
if and only if there is noM-augmenting path. We call anM-alternating walkP an
M-blossomifv 0 ,... , vt− 1 are distinct,v 0 is missed byM, andvt=v 0.
The core of the algorithm is the following observation.
```
```
Theorem 5.2. LetC be an M-blossom inG. ThenM has maximum size inGif
and only ifM/C has maximum size inG/C.
```
```
Proof.LetC= (v 0 , v 1 ,... , vt),G′:=G/CandM′:=M/C.
First letPbe anM-augmenting path inG. We may assume thatPdoes not start
atv 0 (otherwise we can reverseP). IfPdoes not traverse any vertex inC, thenP
is alsoM′-augmenting inG′. IfPdoes traverse a vertex inC, we can decomposeP
asP=QR, whereQends at a vertex inC, and no other vertex onQbelongs toC.
Then by replacing the last vertex ofQbyCmakesQto anM′-augmenting path in
G′.
Conversely, letP′be anM′-augmenting path inG′. IfP′does not traverse vertex
CofG′, thenP′is also anM-augmenting path inG. IfP′traverses vertexCofG′,
we may assume it ends atC(asC is missed byM′). So we can replaceCinP′by
some vertexvi∈C to obtain a pathQinGending atvi. Ifiis odd, extendingQ
byvi+1,... , vt− 1 , vtgives anM-augmenting path inG. Ifiis even, extendingQby
vi− 1 ,... , v 1 , v 0 gives anM-augmenting path inG.
```
```
Another useful observation is (where aW−vwalkis a walk starting at a vertex
inWand ending atv):
```
```
Theorem 5.3.LetP= (v 0 , v 1 ,... , vt)be a shortest even-lengthM-alternatingW−v
walk. Then eitherP is simple or there existi < j such thatvi=vj,iis even,jis
odd, andv 0 ,... , vj− 1 are all distinct.
```
```
Proof.AssumePis not simple. Choosei < jsuch thatvj=viand such thatjis as
small as possible. Ifj−iis even, we can deletevi+1,... , vj fromPso as to obtain
a shorterM-alternatingW−vwalk. Soj−iis odd. Ifjis even andiis odd, then
vi+1=vj− 1 (as it is the vertex matched tovi=vj), contradicting the minimality of
j.
```
```
We now describe an algorithm for the following problem:
```
(13) given: a matchingM;
find: a matchingN with|N|=|M|+ 1 or conclude thatM is a maximum-size
matching.

```
LetW be the set of vertices missed byM.
```

```
Section 5.2. Cardinality matching algorithm 83
```
(14) Case 1.There is noM-alternatingW−W walk.ThenMhas maximum size
(as there is noM-augmenting path).
Case 2.There is anM-alternatingW−W walk.LetP= (v 0 , v 1 ,... , vt) be a
shortest such walk.
Case 2a.P is path. HenceP is an M-augmenting path. Then output N :=
M△EP.
Case 2b.P is not a path. That is, not all vertices inP are different. Choose
i < j such that vi = vj withj as small as possible. ResetM :=
M△{v 0 v 1 , v 1 v 2 ,... , vi− 1 vi}. ThenC:= (vi, vi+1,... , vj) is anM-blossom.
Apply the algorithm (recursively) toG′=G/C andM′:=M/C.

- If it gives an M′-augmenting pathP′ inG′, transformP′ to an
    M-augmenting path inG(as in the proof of Theorem 5.2).
- If it concludes thatM′has maximum size inG′, thenMhas max-
    imum size inG(by Theorem 5.2).

```
This gives a polynomial-time algorithm to find a maximum-size matching, which
is a basic result of Edmonds [1965c].
```
```
Theorem 5.4. Given an undirected graph, a maximum-size matching can be found
in timeO(|V|^2 |E|).
```
```
Proof.The algorithm directly follows from algorithm (14), since one can iteratively
apply it, starting withM=∅, until a maximum-size matching is attained.
By using (12), a shortestM-alternatingW−Wwalk can be found in timeO(|E|).
Moreover, the graphG/Ccan be constructed in timeO(|E|). Since the recursion has
depth at most|V|, each application of algorithm (14) takesO(|V||E|) time. Since the
number of applications is at most|V|, we have the time bound given in the theorem.
```
```
In fact, the method can be sharpened toO(|V|^3 ) (Balinski [1969]),O(|V|^5 /^2 ) (Even
and Kariv [1975]) and even toO(|V|^1 /^2 |E|) (Micali and Vazirani [1980]). For surveys,
see Schrijver [2003].
```
```
Application 5.1: Pairing. If a certain group of people has to be split into pairs, where
certain pairs fit and other pairs do not fit (for instance, whenassigning hotel rooms or bus
seats to a touring group), we have an example of a (perfect) matching problem.
```
```
Application 5.2: Two-processor scheduling. Suppose we have to carry out certain
jobs, where some of the jobs have to be done before other. We can represent this by a
partially ordered set (X,≤) whereXis the set of jobs andx < yindicates that jobxhas
to be done before joby. Each job takes one time-unit, say one hour.
Suppose now that there are two workers, each of which can do one job at a time.
Alternatively, suppose that you have one machine, that can do at each moment two jobs
```

84 Chapter 5. Nonbipartite matching

simultaneously (such a machine is called atwo-processor).
We wish to do all jobs within a minimum total time span. This problem can be solved
with the matching algorithm as follows. Make a graphG= (X,E), with vertex setX(the
set of jobs) and with edge set

(15) E:={{u,v}|u6≤vandv6≤u}.

(So (X,E) is the complementary graph of the ‘comparability graph’ associated with (X,≤).)
Consider now a possible schedule of the jobs. That is, we havea sequencep 1 ,...,pt,
where eachpiis either a singleton vertex or an edge ofGso thatp 1 ,...,ptpartitionXand
so that ifx∈piandy∈pjandx < ytheni < j.^16
Now the pairs in this list should form a matchingMinG. Hencet=|X|−|M|. In
particular,tcannot be smaller than|X|−ν(G), whereν(G) is the matching number ofG.
Now it can be shown that in fact one can always make a schedule witht=|X|−ν(G).
To this end, letQbe a minimum partition ofV into vertices and edges ofG, and letY be
the set of minimal elements ofX. Ifq⊆Y for someq∈Q, we can replaceXbyX\qand
QbyQ\{q}, and apply induction.
So we may assume that eachy∈Y is contained in an edgeyz∈Qwithz6∈Y. Choose
an edgeyz∈Qsuch thaty∈Y and such that the height ofzis as small as possible. (The
heightof an elementzis the maximum size of a chain in (X,≤) with maximum elementz.)
Asz6∈Y there exists any′z′∈Qwithy′∈Y andy′< z.
Now clearlyyy′is an edge ofG, asyandy′are minimal elements. Moreover,zz′is an
edge ofG. For ifz < z′theny′< z < z′, contradicting the fact thaty′z′∈EG; and if
z′< zthanz′would have smaller height thanz.
So replacingyzandy′z′ inQbyyy′ andzz′, we haveyy′ ⊆Y, and we can apply
induction as before.

Exercises

```
5.7. Apply the matching augmenting algorithm to the matchings in the following graphs:
```
```
(i)
```
```
(ii)
```
(^16) Here we identify a vertexvwith the set{v}.


```
Section 5.3. Weighted matching algorithm 85
```
```
(iii)
```
### 5.3. Weighted matching algorithm

```
Edmonds [1965a] proved that also the maximum-weight matching problem can be
solved in polynomial time. Equivalently, the minimum-weight perfect matching prob-
lem can be solved in polynomial time. It is the problem:
```
(16) given: a graphG= (V, E) and a ‘weight’ functionw:E→Q;
find: a perfect matchingMminimizing

###### ∑

```
e∈Mw(e).
```
```
We describe the algorithm, assuming without loss of generality thatGhas at least
one perfect matching and thatw(e)≥0 for each edgee(we can add a constant to
all edge weights without changing the problem).
Like the cardinality matching algorithm, the weighted matching algorithm is based
on shrinking sets of vertices. Unlike the cardinality matching algorithm however, for
weighted matchings one has to ‘deshrink’ sets of vertices (the reverse operation of
shrinking). Thus we have to keep track of the shrinking history throughout the
iterations.
The algorithm is ‘primal-dual’. The ‘vehicle’ carrying us to a minimum-weight
perfect matching is a pair of a nested^17 collection Ω of odd-size subsets ofV, and a
functionπ: Ω→Qsatisfying:
```
```
(17) (i) π(U)≥ 0 ifU∈Ω with|U|≥3,
(ii)
```
###### ∑

```
U∈Ω
e∈δ(U)
```
```
π(U)≤w(e) for eache∈E.
```
```
This implies that for each perfect matchingNinGone hasw(N)≥
```
###### ∑

```
U∈Ω
```
```
π(U), since
```
```
(18) w(N) =
```
###### ∑

```
e∈N
```
```
w(e)≥
```
###### ∑

```
e∈N
```
###### ∑

```
U∈Ω
e∈δ(U)
```
```
π(U) =
```
###### ∑

```
U∈Ω
```
```
π(U)|N∩δ(U)|≥
```
###### ∑

```
U∈Ω
```
```
π(U).
```
```
Notation and assumptions. Let be given Ω andπ: Ω→Q. Define
```
(^17) A collection Ω of subsets of a setV is callednestedifU∩W=∅orU⊆WorW⊆Ufor any
U,W∈Ω.


86 Chapter 5. Nonbipartite matching

(19) wπ(e) :=w(e)−

###### ∑

```
U∈Ω
e∈δ(U)
```
```
π(U)
```
for any edgee∈E. (So (17)(ii) implieswπ(e)≥0.)
G/Ω denotes the graph obtained fromGby shrinking all sets in Ωmax, the set of
inclusionwise maximal sets in Ω. We will assume throughout that{v} ∈Ω for each
v∈V. Hence, as Ω is nested and coversV, Ωmaxis a partition ofV.

When shrinking a setU ∈Ω, we denote the new vertex representing the shrunk
setU just byU. SoG/Ω has vertices the sets in Ωmax, with two distinct elements
U, U′∈Ωmaxadjacent if and only ifGhas an edge connectingU andU′. We denote
any edge ofG/Ω by the original edge inG.
Throughout we restrict ourselves to Ω andπsatisfying:

(20) for eachU∈Ω with|U|≥3, the graph obtained fromG|Uby shrinking all
inclusionwise maximal proper subsets ofUthat are in Ω, has a Hamiltonian
circuitCUof edgesewithwπ(e) = 0.

```
X
```
```
edge inM
edgenotinM
```
```
vertex covered byM
vertexnotcovered byM
Figure 5.1.AnM-alternating forest
```
M-alternating forests.An important role in the algorithm is played by a so-called
‘M-alternating forest’ relative to a matchingM(cf. Figure 5.1).
LetM be a matching in a graphG= (V, E) and let W be the set of vertices
missed byM. Then a subsetFofEis anM-alternating forestinGifF is a forest
containingM such that each component of (V, F) consists either of an edge inM


Section 5.3. Weighted matching algorithm 87

or contains exactly one vertex inW and such that each path inFstarting inW is
M-alternating.
The set of vertices v ∈ V for which there exists an even-length (odd-length,
respectively)W−vpath inFis denoted by even(F) (odd(F), respectively).

The algorithm. We iterate with Ω andπ : Ω →Q satisfying (17) and (20), a
matchingM inG/Ω and anM-alternating forestFinG/Ω withwπ(F) = 0.
Initially, we set M := ∅, F := ∅, Ω := {{v} | v ∈ V}, andπ({v}) := 0 for
eachv∈V. Then, as long asMis not a perfect matching inG/Ω, we perform the
following iteratively:

(21) Resetπ(U) :=π(U)−αforU∈odd(F) andπ(U) :=π(U) +αforU∈
even(F), whereαis the largest value such that (17) is maintained. After
that
(i) there exists an edgee ofG/Ω with wπ(e) = 0 such thate
intersects even(F) but not odd(F),
or (ii) there exists aU∈odd(F) with|U|≥3 andπ(U) = 0.
First assume (i) holds. If only one end ofebelongs to even(F), extendF
bye. If both ends ofebelong to even(F) andF∪{e}contains a circuitC,
letU:=V CandCU:=C, addUto Ω (definingπ(U) := 0), and replaceF
byF/UandMbyM/U. If both ends ofebelong to even(F) andF∪{e}
contains anM-augmenting path, augmentMand resetF:=M.
Next assume (ii) holds. DeleteU from Ω, replaceF byF∪P∪N and
M byM∪N, wherePis the even-length path inCU connecting the two
edges ofFincident withUand whereNis the matching inCUcovering all
vertices inUthat are not covered byM.

(Note that in this iterationαis bounded, since

###### ∑

U∈Ωπ(U) is bounded (by (18), as
there is at least one perfect matching), and since|even(F)|>|odd(F)|(asM is not
perfect).)
IfM is a perfect matching inG/Ω, we are done: by (20) we can expandM to a
perfect matchingNinGwithwπ(N) = 0 and|N∩δ(U)|= 1 for eachU∈Ω; thenN
has equality throughout in (18), and hence it is a minimum-weight perfect matching.

Theorem 5.5. There are at most|V|^2 iterations.

Proof.In any iteration where we augmentM, the value of|V(G/Ω)|− 2 |M|decreases
by 2. If there is no matching augmentation, this value remains invariant. So there
are at most^12 |V|matching augmentations.
LetVeven be the set of verticesv ∈V that are shrunk to a vertex in even(F).
Let Ω 0 be the set of vertices ofG/Ω that do not belong to even(F). Then in any
iteration with no matching augmentation, 2|Veven|+|Ω 0 |increases. Since this value
cannot exceed 2|V|, between any two matching augmentations there are at most 2|V|


88 Chapter 5. Nonbipartite matching

iterations.

```
This gives the theorem of Edmonds [1965a]:
```
Corollary 5.5a. A minimum-weight perfect matching can be found in polynomial
time.

Proof.The nestedness of Ω implies that|Ω|≤ 2 |V|(which is an easy exercise — see
Exercise 5.10). Hence each iteration can be performed in polynomial time. With any
U∈Ω with|U|≥3 we should keep the Hamiltonian circuitCUof (20) — which we
had obtained earlier when shrinkingU.

```
As a consequence one can derive:
```
Corollary 5.5b.In any graph with weight function on the edges, a maximum-weight
matching can be found in polynomial time.

Proof.Left to the reader. (Exercise 5.9.)

The above algorithm can be implemented in timeO(|V|^3 ), which is a result of
Gabow [1973] and Lawler [1976]. Faster algorithms were given by Galil, Micali, and
Gabow [1986] (O(|E||V|log|V|)) and Gabow [1990] (O(|V||E|+|V|^2 log|V|)).
For more about matchings we refer to the book of Lov ́asz and Plummer [1986].

Application 5.3: Optimal pairing. In several practical situations one has to find an
‘optimal pairing’, for example, when scheduling crews for airplanes. Also if one has to
assign bus seats optimally to the participants of an organized tour, or to accommodate the
participants most satisfactorily in two-bed hotel rooms, one has to solve a maximum-weight
perfect matching problem.

Application 5.4: Airline timetabling.A European airline company has for its European
flights a number of airplanes available. Each plane can make on any day two return flights to
European destinations (not necessarily the same destinations). The profit one makes on any
flight depends on the departure and arrival times of the flight(also due to intercontinental
connections). The company wants to make a timetable so that it can be performed by
the available fleet and so that the total profit is maximized. Assume that the number of
destinations to be reached is equal to twice the number of airplanes available.
To solve this problem, consider the complete graph with vertex set all possible destina-
tions. For each edge of this graph, connecting destinationsBandCsay, one calculates the
profit that will be made if one and the same air plane will make its flights toBandC(in
one order or the other). So one determines the optimum schedule for the flights toBandC
so that the two return flights can be done by the same airplane and so that the total profit
on the two flights is maximized.
Now a timetable yielding maximum profit is found by determining a maximum-weight


```
Section 5.3. Weighted matching algorithm 89
```
```
perfect matching in this graph.
```
```
Application 5.5: Chinese postman problem. TheChinese postman problem, first
studied by Guan [1960], consists of the following. Given a connected graphG= (V,E) and
a length functionl:E→Q+, find a minimum-length tourT that traverses each edgeat
leastonce.
It is not difficult to see that if each vertex ofGhas an even degree, then the optimal
tour traverses each edgeexactlyonce. But if the graph has vertices of odd degree, certain
edges have to be traversed more than once. To find such edges wecan proceed as follows.
First determine the setUof vertices of odd degree. Note that|U|is even. For each pair
u,u′of vertices inUdetermine the distanced(u,u′) betweenuandu′in the graphG(taking
las length). Consider the complete graphH= (U,E′) onU. Determine a minimum-weight
perfect matchingMinH, takingdas weight function. For each edgeuu′inMwe can
determine a pathPu,u′inGof lengthd(u,u′). It can be shown that any two different such
paths do not have any edge in common (assuming that each edge has positive length) —
see Exercise 5.13. LetE ̃be the set of edges occurring in thePu,u′(uu′∈M). Then there
exists a tourTso that each edgee∈E\E ̃is traversed exactly once and each edgee∈E ̃is
traversed exactly twice. This tourT is a shortest ‘Chinese postman tour’ (Exercise 5.14).
```
```
Application 5.6: Christofides’ approximative algorithm for the traveling sales-
man problem.Christofides [1976] designed the following algorithm to finda short travel-
ing salesman tour in a graph (generally not the shortest however). Thetraveling salesman
problemis the problem, given a finite setV and a ‘length’ functionl:V×V →Q+, to find
a shortest traveling salesman tour. Atraveling salesman tour(orHamiltonian circuit) is a
circuit in the complete graph onV traversing each vertex exactly once.
Suppose that the length function is symmetric (that is,l(u,v) =l(v,u) for allu,v∈V)
and satisfies the triangle inequality:
```
```
(22) l(u,w)≤l(u,v) +l(v,w)
```
```
for allu,v,w∈V. Then a reasonably short traveling salesman tour can be found as follows.
First determine a shortest spanning treeS(with the greedy algorithm). Next, letUbe
the set of vertices that have odd degree inS. Find a shortest perfect matchingMonU,
takinglas weight function. NowES∪Mforms a set of edges such that each vertex has
even degree. (If an edge occurs both inESand inM, we take it as two parallel edges.) So
we can make a cycleT such that each edge inES∪Mis traversed exactly once. ThenT
traverses each vertex at least once. By inserting shortcutswe obtain a traveling salesman
tourT′with length(T′)≤length(T).
How far away is the length ofT′from the length of a shortest traveling salesman tour?
Letρbe the length of a shortest traveling salesman tour. It is notdifficult to show that:
```
(23) (i) length(S)≤ρ;
(ii) length(M)≤^12 ρ.

```
(Exercise 5.18.) Hence
```

90 Chapter 5. Nonbipartite matching

(24) length(T′)≤length(T) =length(S)+length(M)≤^32 ρ.

So the tour obtained with Christofides’ algorithm is not longer than^32 times the optimal
tour.
The factor^32 seems quite large, but it is the smallest factor for which a polynomial-time
method is known. Don’t forget moreover that it is aworst-casebound, and that in practice
(or on average) the algorithm might have a much better performance.

Exercises

```
5.8. Find with the weighted matching algorithm a minimum-weight perfect matching in
the following weighted graphs:
```
```
(i)
```
```
1
```
```
1
```
```
1
3
```
```
4
```
```
2
```
```
7
```
```
5
```
```
6
```
```
(ii)
```
```
0
```
```
0
```
```
0
```
```
0
```
```
1
```
```
6
```
(^05)
0
1
2
4
1
8
5
6
7
3
5.9. Derive Corollary 5.5b from Corollary 5.5a.
5.10. A collection Ω of subsets of a finite setV is calledcross-freeif:
(25) ifX,Y ∈Ω, thenX⊆Y, orY ⊆X, orX∩Y =∅, orX∪Y =V.
Show that if Ω is cross-free, then|Ω|≤ 4 |V|.
5.11. Find a shortest Chinese postman route in the graph in Figure 5.2.
5.12. Find a shortest Chinese postman route in the map of Figure 5.3.
5.13. Show that the paths found in the algorithm for the Chinese postman problem pairwise
do not have any edge in common (if each edge has positive length).


Section 5.4. The matching polytope 91

```
2
```
```
6
```
```
5
```
```
9
```
(^43)
1
3
(^21)
8
3
3
3
6
2 3
3
3 4 5 3 4 3
(^45)
3
5
4
1
2
2
Figure 5.2
5.14. Show that the tour found in Application 5.5 is indeed a shortest Chinese postman
tour.
5.15. Apply Christofides’ algorithm to the table in Exercise1.8.
5.16. LetG= (V,E) be a graph and letT ⊆V with|T|even. Call a subsetF ofEa
T-joinifT is equal to the set of vertices of odd degree in the graph (V,F).
Derive from Corollary 5.5a that a minimum-weightT-join can be found in polynomial
time.
5.17. LetG= (V,E) be a graph and letl:E→Qbe a length function such that each
circuit has nonnegative length. Lets,t∈V.
Derive from the minimum-weight perfect matching algorithman algorithm to find a
minimum-lengths−tpath inG.
5.18. Show (23).

### 5.4. The matching polytope

The weighted matching algorithm of Edmonds [1965a] gives asa side result a charac-
terization of the perfect matching polytopePperfect matching(G) of any graphG. This
is Edmonds’ matching polytope theorem.
Theperfect matching polytopeof a graphG= (V, E), denoted byPperfect matching(G),
is the convex hull of the incidence vectors of the perfect matchings inG.^18 That is,

(^18) For any finite setXand any subsetY ofX, theincidence vectororincidence functionof a
subsetYofXis the vectorχY∈RXdefined by:χYx:= 1 ifx∈YandχYx:= 0 otherwise.


92 Chapter 5. Nonbipartite matching

```
Figure 5.3.Part of the Xuhui district of Shanghai
```
(26) Pperfect matching(G) =conv.hull{χM|Mperfect matching inG}.

SoPperfect matching(G) is a polytope inRE.

In Section 3.6 we saw that for a bipartite graphG= (V, E), the perfect matching
polytope is fully determined by the following set of inequalities:

(27) (i) xe ≥0 for eache∈E;
(ii)

###### ∑

```
e∋vxe = 1 for eachv∈V.
```
These inequalities are not enough for, say,K 3 : takingx(e) :=^12 for each edgeeofK 3
gives a vectorxsatisfying (27) but not belonging to the perfect matching polytope
ofK 3.
Edmonds [1965a] showed that it is enough to add the followingset of inequalities:

###### (28)

###### ∑

```
e∈δ(U)
```
```
xe≥1 for each odd subsetUofV.
```
It is clear that for any perfect matchingMinGthe incidence vectorχMsatisfies
(28). So clearly,Pperfect matching(G) is contained in the polyhedronQdefined by (27)
and (28). The essence of Edmonds’ theorem is that one does notneed more.

In order to show Edmonds’ theorem, we derive from Edmonds’ algorithm the
following theorem, wherePodd(V) denotes the collection of odd subsets ofV:

Theorem 5.6.LetG= (V, E)be a graph and letw:E→Qbe a ‘weight’ function.
Then the minimum weight of a perfect matching is equal to the m∑ aximum value of

```
X∈Podd(V)π(X)whereπranges over all functionsπ:Podd(V)→Qsatisfying(17).
```

Section 5.4. The matching polytope 93

Proof.We may assume thatwis nonnegative: ifμis the minimum value ofw(e) over
all edgese, decreasing eachw(e) byμdecreases both the maximum and the minimum
by^12 |V|μ.
The fact that the minimum is not smaller than the maximum follows from (18).
Equality follows from the fact that in the algorithm the finalperfect matching and
the final functionπhave equality throughout in (18).

```
This implies:
```
Corollary 5.6a(Edmonds’ perfect matching polytope theorem).The perfect match-
ing polytope of any graphG= (V, E)is determined by(27)and(28).

Proof.By Theorem 5.6 and LP-duality, for any weight functionw∈QE, the min-
imum weight of a perfect matching is equal to the minimum ofwTxtaken over the
polytope determined by (27) and (28). Hence the two polytopescoincide, by Theorem
2.1.

From this one can derive Edmonds’ matching polytope theorem, characterizing
thematching polytopeof a graphG= (V, E), denoted byPmatching(G), which is the
convex hull of the incidence vectors of the matchings inG. That is,

(29) Pmatching(G) =conv.hull{χM|Mmatching inG}.

Again,Pmatching(G) is a polytope inRE.

Corollary 5.6b(Edmonds’ matching polytope theorem).For any graphG= (V, E)
the matching polytope is determined by:

(30) (i) xe ≥ 0 for eache∈E;
(ii)

###### ∑

```
e∋vxe ≤^1 for eachv∈V;
(iii)
```
###### ∑

```
e⊂Uxe ≤⌊
```
```
1
2 |U|⌋ for eachU⊆V with|U|odd.
```
Proof.Left to the reader (Exercise 5.21).

```
This in turn has the following consequence:
```
Corollary 5.6c.LetG= (V, E)be a graph and letw:E→Q+. Then the maximum
weight of a matching is equal to the minimum value of

###### (31)

###### ∑

```
v∈V
```
```
yv+
```
###### ∑

```
U⊆V
```
```
zU⌊
```
###### 1

###### 2

###### |U|⌋,


94 Chapter 5. Nonbipartite matching

wherey∈QV+andz∈QP+odd(V)satisfy

###### ∑

```
v∈eyv+
```
###### ∑

U∈Podd(V),e⊆UzU≥w(e)for each
edgee.

Proof.Directly with LP-duality from Corollary 5.6b.

In fact, Cunningham and Marsh’ theorem shows that ifwis integer-valued, we
can restrictyandzto integer vectors — see Section 5.5.

Exercises

```
5.19. Show that for any graphG= (V,E), if the inequalities (30)(i)(ii) fully determine the
matching polytope, thenGis bipartite.
```
```
5.20. Show that the perfect matching polytope of a graphG= (V,E) is also determined
by the following inequalities:
```
```
(32) ∑ xe ≥ 0 for eache∈E;
```
```
e∈δ(U)
```
```
xe ≥ 1 for each odd subsetUofV;
∑
```
```
e∈E
```
```
xe =^12 |V|.
```
```
5.21. Derive Edmonds’ matching polytope theorem from Edmonds’ perfect matching poly-
tope theorem.
```
```
5.22. Derive from Edmonds matching polytope theorem the linear inequalities determining
the convex hull of allsymmetricpermutation matrices.
```
```
5.23. LetG= (V,E) be a graph. Show that the convex hull of the incidence vectors of
matchings of sizekis equal to the intersection of the matching polytope ofGwith
the hyperplane{x| 1 Tx=k}.
```
```
5.24. LetG= (V,E) be a graph. Show that the convex hull of the incidence vectors of
matchings of size at leastkand at mostlis equal to the intersection of the matching
polytope ofGwith the set{x|k≤ 1 Tx≤l}.
```
##### 5.5. The Cunningham-Marsh formula

Cunningham and Marsh [1978] showed a more general result, which generalizes both
Edmonds’ matching polytope theorem and the Tutte-Berge formula. We give a direct
proof.

Theorem 5.7(Cunningham-Marsh formula). In Corollary5.6c, ifw is integer, we
can takeyandz integer.


Section 5.5. The Cunningham-Marsh formula 95

Proof.We must give a matchingMand integer valuesyv, zUas required withw(M)
equal to (31).

LetT be equal to the maximum weight of a matching and letMbe the set of
matchingsMof weightT. We prove the theorem by induction onT. We may assume
thatGis the complete graph onV. LetG, wbe a counterexample to the theorem
with (fixingV andT)

###### ∑

e∈Ew(e) as large as possible.
First assume that there exists a vertexuofGcovered by every matchingM∈M.
Letw′ be obtained fromwby decreasingw(e) by 1 for each edgeeincident withu
withw(e)≥1. Then the maximum ofw′(M) over all matchingsMis equal toT−1,
since eachM ∈ Mcontains an edgeeincident withuwithw(e)≥ 1. Hence, by
induction, there existy′v, zU′ as required forw′. Now increasingy′uby 1 and leaving
all other values ofy′v, z′Uinvariant, givesyv, zUas required forw.
So we may assume that for each vertexvthere exists a matchingM ∈ Mnot
coveringv. We show that for each three distinct verticesa, b, c∈V one has

(33) w(ac)≥min{w(ab), w(bc)}.

Indeed, by the maximality of

###### ∑

e∈Ew(e) there exists a matchingM∈Mcontaining
ac. (Otherwise we could increase the weight ofacwithout increasingT, contradicting
the maximality of

###### ∑

```
e∈Ew(e).) Moreover, there exists a matching M
```
```
′ ∈ Mnot
```
coveringb. LetPbe the component ofM∪M′containingac. At least one component,
Qsay, ofP\{ac}does not containb. By symmetry ofaandcwe may assume that
Qcontainsa. ThenM△(Q∪{ac}) andM′△(Q∪{ab}) are matchings again. Now
w(M△(Q∪{ac}))≤T=w(M), and sow(Q∩M′)≤w(Q∩M) +w(ac). Moreover,
w(M′△(Q∪{ab}))≤T=w(M′), and sow(Q∩M) +w(ab)≤w(Q∩M′). Hence
w(ab)≤w(ac), proving (33).

For each natural numbern≥1 letGnbe the graph onV with as edges alle∈E
withw(e)≥n, and letKn be the set of components ofGn. Consider somenand
someU∈Kn.
By (33),G|U is a complete graph. We show that eachM∈ Mcontains exactly
⌊^12 |U|⌋edges that are inEU (= set of edges contained inU).

Suppose to the contrary thatUcontains two verticesaandbsuch thataandbare
not covered by any edge inM∩EU. Ifaorbis not covered byMwe could replace the
edge inM incident withaorb(if any) by the edgeab, thereby increasing the weight
— a contradiction. So we may assume thatac, bd∈Mfor somec, d6∈U. By (33),
w(cd)≥min{w(ac), w(ad)}≥min{w(ac), w(ab), w(bd)}= min{w(ac), w(bd)}. Since
w(ab)>max{w(ac), w(bd)}this impliesw(ab) +w(cd)> w(ac) +w(bd). Therefore,
replacingacandbdinM byabandcdwould increase the weight — a contradiction.
So|M∩EU|=⌊^12 |U|⌋.
For eachU⊆V with|U|>1, definezUas the number of natural numbersn≥ 1
for whichU∈ Kn. Then

###### ∑

U⊇ezU≥w(e) for each edgee(sinceeis inw(e) graphs
Gn). Moreover, chooseM∈Marbitrarily. Then


96 Chapter 5. Nonbipartite matching

###### (34)

###### ∑

```
U⊆V
```
```
zU⌊
```
###### 1

###### 2

###### |U|⌋=

###### ∑∞

```
n=1
```
###### ∑

```
U∈Kn
```
###### ⌊

###### 1

###### 2

###### |U|⌋=

###### ∑∞

```
n=1
```
###### ∑

```
U∈Kn
```
###### |M∩EU|

###### =

###### ∑

```
e∈M
```
```
(number ofn, U withe⊆U∈Kn) =
```
###### ∑

```
e∈M
```
```
w(e).
```
Exercises

```
5.25. Derive the Tutte-Berge formula from the Cunningham-Marsh formula (Theorem 5.7).
```
```
5.26. Derive Edmonds’ matching polytope theorem from the Cunningham-Marsh formula
(Theorem 5.7).
```

###### 97

### 6. Problems, algorithms, and running time

##### 6.1. Introduction

Probably most of the readers will have some intuitive idea about what is a problem
and what is an algorithm, and what is meant by the running timeof an algorithm. Al-
though for the greater part of this course this intuition will be sufficient to understand
the substance of the matter, in some cases it is important to formalize this intuition.
This is particularly the case when we deal with concepts likeNP and NP-complete.
The class of problems solvable in polynomial time is usuallydenoted by P. The
class NP, that will be described more precisely below, is a class of problems that
might be larger (and many people believe itislarger). It includes most combinatorial
optimization problems, including all problems that are in P. That is: P⊆NP. In
particular, NP doesnot mean: “non-polynomial time”. The letters NP stand for
“nondeterministic polynomial-time”. The class NP consists, roughly speaking, of all
those questions with the property that for any input that hasa positive answer, there
is a ‘certificate’ from which the correctness of this answer can be derived in polynomial
time.
For instance, the question:

(1) ‘Given a graphG, isGHamiltonian?’

belongs to NP. If the answer is ‘yes’, we can convince anyone that this answer is
correct by just giving a Hamiltonian circuit inGas a certificate. With this certificate,
the answer ‘yes’ can be checked in polynomial time — in fact: trivially. Here it is
not required that we are able tofindthe certificate in polynomial time. The only
requirement is that there exists a certificate which can be checked in polynomial
time.
Checking the certificate in polynomial time means: checkingit in time bounded
by a polynomial in the original input. In particular, it implies that the certificate
itself has size bounded by a polynomial in the original input.
To elucidate the meaning of NP, it is not known if for any graphG for which
question (1) has anegativeanswer, there is a certificate from which the correctness of
this answer can be derived in polynomial time. So there is an easy way of convincing
‘your boss’ that a certain graph is Hamiltonian (just by exhibiting a Hamiltonian
circuit), but no easy way is known for convincing this personthat a certain graph is
non-Hamiltonian.
Within the class NP there are the “NP-complete” problems. These are by defi-
nition the hardest problems in the class NP: a problem Π in NP is NP-completeif


98 Chapter 6. Problems, algorithms, and running time

every problem in NP can be reduced to Π, in polynomial time. It implies that if one
NP-complete problem can be proved to be solvable in polynomial time, then each
problem in NP can be solved in polynomial time. In other words:then P=NP would
follow.
Surprisingly, there are several prominent combinatorial optimization problems
that are NP-complete, like the traveling salesman problem and the problem of finding
a maximum clique in a graph. This pioneering eye-opener was given by Cook [1971]
and Karp [1972].
Since that time one generally sets the polynomially solvable problems against the
NP-complete problems, although there is no proof that these two concepts really are
distinct. For almost every combinatorial optimization problem one has been able
either to prove that it is solvable in polynomial time, or that it is NP-complete. But
theoretically it is still a possibility that these two concepts are just the same! Thus
it is unknown which of the two diagrams in Figure 6.1 applies.

```
NP
```
```
NP-c
```
```
P
```
```
NP-c P=NP
```
```
Figure 6.1
```
Below we make some of the notions more precise. We will not elaborate all tech-
nical details fully, but hope that the reader will be able to see the details with not
too much effort. For precise discussions we refer to the booksby Aho, Hopcroft, and
Ullman [1974], Garey and Johnson [1979], and Papadimitriou [1994].

##### 6.2. Words

If we use the computer to solve a certain graph problem, we usually do not put a
picture of the graph in the computer. (We are not working withanalog computers,
but with digital computers.) Rather we put some appropriateencoding of the problem
in the computer, by describing it by a sequence of symbols taken from some fixed
finite ‘alphabet’ Σ. We can take for Σ for instance the ASCII setof symbols or the
set{ 0 , 1 }. It is convenient to have symbols like ( , ) ,{,}and the comma in Σ, and
moreover some symbol like meaning: ‘blank’. Let us fix one alphabet Σ.


Section 6.2. Words 99

We call any ordered finite sequence of elements from Σ aword. The set of all
words is denoted by Σ∗.

```
e
```
```
d
```
```
b
```
```
c
```
```
a
```
```
Figure 6.2
```
It is not difficult to encode objects like rational numbers, vectors, matrices, graphs,
and so on, as words. For instance, the graph given in Figure 6.2 can be encoded, as
usual, by the word:

(2) ({a, b, c, d, e},{{a, b},{a, c},{b, c},{c, d},{d, e},{e, a}}).

A function f defined on a finite setX can be encoded by giving the set of pairs
(x, f(x)) withx∈X. For instance, the following describes a function defined onthe
edges of the graph above:

###### (3)

```
{({a, b},32),({a, c},−17),({b, c}, 5 /7),({c, d},6),({d, e},−1),({e, a},−9)}.
```
A pair of a graph and a function can be described by the word (w, v), wherewis the
encoding of the graph andvis the encoding of the function.

Thesizeof a wordwis the number of symbols used inw, counting multiplicities.
(So the wordabaa 32 bchas size 8.) The size is important when we make estimates on
the running time of algorithms.

Note that in encoding numbers (integers or rational numbers), the size depends
on the number of symbols necessary to encode these numbers. Thus if we encounter
a problem on a graph with numbers defined on the edges, then thesize of the input
is the total number of bits necessary to represent this structure. It might be much
larger than just the number of nodes and edges of the graph, and much smaller than
the sum of all numbers occurring in the input.

Although there are several ways of choosing an alphabet and encoding objects by
words over this alphabet, any way chosen is quite arbitrary.We will be dealing with
solvability in polynomial time in this chapter, and for thatpurpose most encodings
are equivalent. Below we will sometimes exploit this flexibility.


100 Chapter 6. Problems, algorithms, and running time

##### 6.3. Problems

What is a problem? Informally, it is a question or a task, for instance, “Does this given
graph have a perfect matching?” or “Find a shortest traveling salesman tour in this
graph!”. In fact there are two types of problems: problems that can be answered by
‘yes’ or ‘no’ and those that ask you to find an object with certain prescribed properties.
We here restrict ourselves to the first type of problems. Froma complexity point of
view this is not that much of a restriction. For instance, theproblem of finding a
shortest traveling salesman tour in a graph can be studied bythe related problem:
Given a graph, a length function on the edges, and a rational numberr, does there
exist a traveling salesman tour of length at mostr? If we can answer this question
in polynomial time, we can find the length of a shortest tour inpolynomial time, for
instance, by binary search.
So we study problems of the form: Given a certain object (or sequence of objects),
does it have a certain property? For instance, given a graphG, does it have a perfect
matching?
As we encode objects by words, a problem is nothing but: given awordw, does
it have a certain property? Thus the problem is fully described by describing the
“certain property”. This, in turn, is fully described by just the set of all words
that have the property. Therefore we have the following mathematical definition: a
problemis any subset Π of Σ∗.
If we consider any problem Π⊆Σ∗, the corresponding ‘informal’ problem is:

(4) Given wordw, doeswbelong to Π?

In this context, the wordwis called aninstanceor theinput.

##### 6.4. Algorithms and running time

An algorithm is a list of instructions to solve a problem. The classical mathematical
formalization of an algorithm is theTuring machine. In this section we will describe
a slightly different concept of an algorithm (the ‘Thue system’) that is useful for our
purposes (explaining NP-completeness). In Section 6.10 below we will show that it is
equivalent to the notion of a Turing machine.
A basic step in an algorithm is: replace subwordubyu′. It means that if word
w is equal totuv, wheretandvare words, we replacewby the wordtu′v. Now
by definition, analgorithmis a finite list of instructions of this type. It thus is fully
described by a sequence

(5) ((u 1 , u′ 1 ),... ,(un, u′n)),

whereu 1 , u′ 1 ,... , un, u′nare words. We say that wordw′follows fromwordwif there


Section 6.5. The class NP 101

exists aj∈{ 1 ,... , n}such thatw=tujvandw′=tu′jvfor certain wordstandv, in
such a way thatjis the smallest index for which this is possible and the size oftis as
small as possible. The algorithmstops atwordwifwhas no subword equal to one of
u 1 ,... , un. So for any wordw, either there is a unique wordw′that follows fromw,
or the algorithm stops atw. A (finite or infinite) sequence of wordsw 0 , w 1 , w 2 ,.. .is
calledallowedif eachwi+1follows fromwiand, if the sequence is finite, the algorithm
stops at the last word of the sequence. So for each wordwthere is a unique allowed
sequence starting withw. We say thatAacceptswif this sequence is finite.
For reasons of consistency it is important to have the ‘emptyspace’ at both sides
of a word as part of the word. Thus instead of starting with a wordw, we start with
w, where is a symbol indicating space.
LetAbe an algorithm and let Π⊆Σ∗be a problem. We say thatAsolvesΠ if
Π equals the set of words accepted byA. Moreover,Asolves Πin polynomial-timeif
there exists a polynomialp(x) such that for any wordw∈Σ∗: ifAacceptsw, then
the allowed sequence starting withwcontains at mostp(size(w)) words.
This definition enables us indeed to decide in polynomial time if a given wordw
belongs to Π. We just takew 0 :=w, and next, fori= 0, 1 , 2 ,.. ., we choose ‘the first’
subworduj inwiand replace it byu′j (for somej∈{ 1 ,... , n}) thus obtainingwi+1.
If withinp(size(w)) iterations we stop, we know thatwbelongs to Π, and otherwise
we know thatwdoes not belong to Π.
Then P denotes the set of all problems that can be solved by a polynomial-time
algorithm.

##### 6.5. The class NP

We mentioned above that NP denotes the class of problems for which a positive
answer has a ‘certificate’ from which the correctness of the positive answer can be
derived in polynomial time. We will now make this more precise.
The class NP consists of those problems Π⊆Σ∗for which there exist a problem
Π′∈P and a polynomialp(x) such that for anyw∈Σ∗:

(6) w∈Π if and only if there exists a wordvsuch that (w, v)∈Π′and such
that size(v)≤p(size(w)).

So the wordvacts as a certificate showing thatwbelongs to Π. With the polynomial-
time algorithm solving Π′, the certificate proves in polynomial time thatwbelongs
to Π.
As examples, the problems

(7) Π 1 :={G|Gis a graph having a perfect matching}and
Π 2 :={G|Gis a Hamiltonian graph}


102 Chapter 6. Problems, algorithms, and running time

(encodingGas above) belong to NP, since the problems

(8) Π′ 1 := {(G, M)|Gis a graph andM is a perfect matching inG}
and
Π′ 2 := {(G, H)|Gis a graph andHis a Hamiltonian circuit in
G}

belong to P.
Similarly, the problem

(9) TSP := {(G, l, r)| G is a graph, l is a ‘length’ function on the
edges ofGandris a rational number such thatGhas a
Hamiltonian tour of length at mostr}

(‘the traveling salesman problem’) belongs to NP, since the problem

(10) TSP′ := {(G, l, r, H)|Gis a graph,lis a ‘length’ function on the
edges ofG,ris a rational number, andHis a Hamiltonian
tour inGof length at mostr}

belongs to P.
Clearly, P⊆NP, since if Π belongs to P, then we can just take the empty string
as certificate for any wordw to show that it belongs to Π. That is, we can take
Π′:={(w,)|w∈Π}. As Π∈P, also Π′∈P.
The class NP is apparently much larger than the class P, and there might be not
much reason to believe that the two classes are the same. But,as yet, nobody has
been able to show that they really are different! This is an intriguing mathematical
question, but besides, answering the question might also have practical significance.
If P=NP can be shown, the proof might contain a revolutionary new algorithm,
or alternatively, it might imply that the concept of ‘polynomial-time’ is completely
useless. If P 6 =NP can be shown, the proof might give us more insight in the reasons
why certain problems are more difficult than other, and might guide us to detect and
attack the kernel of the difficulties.

##### 6.6. The class co-NP

By definition, a problem Π⊆Σ∗belongs to the class co-NP if the ‘complementary’
problemΠ := Σ∗\Π belongs to NP.
For instance, the problem Π 1 defined in (7) belongs to co-NP, since the problem

(11) Π′′ 1 := {(G, W)|Gis a graph andWis a subset of the vertex set
ofGsuch that the graphG−Whas more than|W|odd
components}


Section 6.7. NP-completeness 103

belongs to P. This follows from Tutte’s ‘1-factor theorem’ (Corollary 5.1a): a graphG
has no perfect matching if and only if there is a subsetW of the vertex set ofGwith
the properties described in (11). (Here, strictly speaking,the complementary problem
Π 1 of Π 1 consists of all wordswthat either do not represent a graph, or represent
a graph having no perfect matching. We assume however that there is an easy way
of deciding if a given word represents a graph. Therefore, wemight assume that the
complementary problem is just{G|Gis a graph having no perfect matching}.)
It is not known if the problems Π 2 and TSP belong to co-NP.
Since for any problem Π in P also the complementary problemΠ belongs to P,
we know that P⊆co-NP. So P⊆NP∩co-NP. The problems in NP∩co-NP are those for
which there exist certificates both in case the answer is positive and in case the answer
is negative. As we saw above, the perfect matching problem Π 1 is such a problem.
Tutte’s theorem gives us the certificates. Therefore, Tutte’s theorem is called agood
characterization.
In fact, there are very few problems known that are proved to belong to NP∩co-NP,
but that are not known to belong to P. Most problems having a good characterization,
have been proved to be solvable in polynomial time. The notable exception for which
this is not yet proved isprimality testing(testing if a given natural number is a prime
number).

##### 6.7. NP-completeness

The NP-complete problems are by definition the hardest problems in NP. To be more
precise, we first define the concept of a polynomial-time reduction. Let Π and Π′
be two problems and letAbe an algorithm. We say thatAis apolynomial-time
reductionof Π′to Π ifAis a polynomial-time algorithm (‘solving’ Σ∗), so that for
any allowed sequence starting withwand ending withvone has:w∈Π′if and only
ifv∈Π. A problem Π is called NP-complete, if Π∈NP and for each problem Π′in
NP there exists a polynomial-time reduction of Π′to Π.

It is not difficult to see that if Π belongs to P and there exists apolynomial-time
reduction of Π′to Π, then also Π′belongs to P. It implies that if one NP-complete
problem can be solved in polynomial time, then each problem in NP can be solved in
polynomial time. Moreover, if Π belongs to NP, Π′is NP-complete and there exists
a polynomial-time reduction of Π′to Π, then also Π is NP-complete.

##### 6.8. NP-completeness of the satisfiability problem

We now first show that in fact there exist NP-complete problems. In fact we show
that the so-calledsatisfiability problem, denoted by SAT, is NP-complete.
To define SAT, we need the notion of aboolean expression. Examples are:


104 Chapter 6. Problems, algorithms, and running time

(12) ((x 2 ∧x 3 )∨¬(x 3 ∨x 5 )∧x 2 ), ((¬x 47 ∧x 2 )∧x 47 ),¬(x 7 ∧¬x 7 ).

Boolean expressions can be defined inductively. First, for each natural numbern,
the ‘word’xn is a boolean expression (using some appropriate encoding ofnatural
numbers and of subscripts). Next, ifv andw are boolean expressions, then also
(v∧w), (v∨w) and¬vare boolean expressions. These rules give us all boolean
expressions. (If necessary, we may use other subscripts than the natural numbers.)
Now SAT is a subcollection of all boolean expressions, namelyit consists of those
boolean expressions that are satisfiable. A boolean expression f(x 1 , x 2 , x 3 ,.. .) is
calledsatisfiableif there existα 1 , α 2 , α 3 ,.. .∈ { 0 , 1 }such thatf(α 1 , α 2 , α 3 ,.. .) = 1,
using the well-known identities

###### (13) 0 ∧0 = 0∧1 = 1∧0 = 0, 1 ∧1 = 1,

###### 0 ∨0 = 0, 0 ∨1 = 1∨0 = 1∨1 = 1,

###### ¬0 = 1,¬1 = 0,(0) = 0,(1) = 1.

Exercise. Letn≥1 be a natural number and letW be a collection of words in
{ 0 , 1 }∗all of lengthn. Prove that there exists a boolean expressionf(x 1 ,... , xn) in
the variablesx 1 ,... , xnsuch that for each wordw=α 1... αnin the symbols 0 and 1
one has:w∈W if and only iff(α 1 ,... , αn) = 1.

The satisfiability problem SAT trivially belongs to NP: we cantake as certificate
for a certainf(x 1 , x 2 , x 3 ,.. .) to belong to SAT, the equationsxi=αithat givefthe
value 1. (We only give those equations for whichxioccurs inf.)
To show that SAT is NP-complete, it is convenient to assume that Σ ={ 0 , 1 }.
This is not that much a restriction: we can fix some order of thesymbols in Σ, and
encode the first symbol by 10, the second one by 100, the third one by 1000, and so
on. There is an easy (certainly polynomial-time) way of obtaining one encoding from
the other.
The following result is basic for the further proofs:

Theorem 6.1. LetΠ ⊆ { 0 , 1 }∗ be inP. Then there exist a polynomial p(x)and
an algorithm that finds for each natural numbernin timep(n)a boolean expression
f(x 1 , x 2 , x 3 ,.. .)with the property:

(14) any wordα 1 α 2... αnin{ 0 , 1 }∗belongs toΠif and only if the boolean ex-
pressionf(α 1 ,... , αn, xn+1, xn+2,.. .)is satisfiable.

Proof.Since Π belongs to P, there exists a polynomial-time algorithmAsolving Π.
So there exists a polynomialp(x) such that a wordwbelongs to Π if and only if the
allowed sequence forwcontains at mostp(size(w)) words. It implies that there exists


```
Section 6.8. NP-completeness of the satisfiability problem 105
```
```
a polynomialq(x) such that any word in the allowed sequence forwhas size less than
q(size(w)).
We describe the algorithm meant in the theorem. Choose a natural numbern.
Introduce variablesxi,jandyi,jfori= 0, 1 ,... , p(n),j= 1,... , q(n). Now there exists
(cf. the Exercise above) a boolean expressionfin these variables with the following
properties. Any assignmentxi,j:=αi,j∈{ 0 , 1 }andyi,j:=βi,j∈{ 0 , 1 }makesfequal
to 1 if and only if the allowed sequence starting with the wordw 0 :=α 0 , 1 α 0 , 2... α 0 ,n
is a finite sequencew 0 ,... , wk, so that:
```
(15) (i)αi,jis equal to thejth symbol in the wordwi, for eachi≤ kand each
j≤size(wi);
(ii)βi,j= 1 if and only ifi > korj≤size(wi).

```
The important point is thatfcan be found in time bounded by a polynomial in
n. To see this, we can encode the fact that wordwi+1should follow from wordwi
by a boolean expression in the ‘variables’xi,j andxi+1,j, representing the different
positions inwiandwi+1. (The extra variablesyi,jandyi+1,jare introduced to indicate
the sizes ofwiandwi+1.) Moreover, the fact that the algorithm stops at a wordw
also can be encoded by a boolean expression. Taking the ‘conjunction’ of all these
boolean expressions, will give us the boolean expressionf.
```
```
As a direct consequence we have:
```
```
Corollary 6.1a.Theorem6.1also holds if we replacePbyNPin the first sentence.
```
```
Proof. Let Π ⊆ { 0 , 1 }∗ belong to NP. Then, by definition of NP, there exists a
problem Π′ in P and a polynomialr(x) such that any wordw belongs to Π if and
only if (w, v) belongs to Π′for some wordvwith size(v)≤r(size(w)). By properly
re-encoding, we may assume that for eachn∈N, any wordw∈{ 0 , 1 }∗belongs to Π
if and only ifwvbelongs to Π′for some wordvof sizer(size(w)). Applying Theorem
6.1 to Π′gives the corollary.
```
```
Now the main result of Cook [1971] follows:
```
```
Corollary 6.1b(Cook’s theorem).The satisfiability problemSATisNP-complete.
```
```
Proof.Let Π belong to NP. We describe a polynomial-time reduction ofΠ to SAT.
Let w = α 1... αn ∈ { 0 , 1 }∗. By Corollary 6.1a we can find in time bounded by
a polynomial inna boolean expressionf such thatwbelongs to Π if and only if
f(α 1 ,... , αn, xn+1,.. .) is satisfiable. This is the required reduction to SAT.
```

106 Chapter 6. Problems, algorithms, and running time

##### 6.9. NP-completeness of some other problems

We next derive from Cook’s theorem some of the results of Karp[1972]. First we
show that the 3-satisfiability problem3-SAT is NP-complete. LetB 1 be the set of
all wordsx 1 ,¬x 1 , x 2 ,¬x 2 ,.. .. LetB 2 be the set of all words (w 1 ∨···∨wk), where
w 1 ,···, wkare words inB 1 and 1≤k≤3. LetB 3 be the set of all wordsw 1 ∧.. .∧wk,
wherew 1 ,... , wk are words inB 2. Again, we say that a wordf(x 1 , x 2 ,.. .)∈B 3 is
satisfiable if there exists an assignmentxi := αi ∈ { 0 , 1 }(i= 1, 2 ,.. .) such that
f(α 1 , α 2 ,.. .) = 1 (using the identities (13)).

Now the 3-satisfiability problem 3-SAT is: Given a wordf ∈B 3 , decide if it is
satisfiable.

Corollary 6.1c.The 3-satisfiability problem3-SATisNP-complete.

Proof.We give a polynomial-time reduction of SAT to 3-SAT. Letf(x 1 , x 2 ,.. .) be a
boolean expression. Introduce a variableygfor each subwordgoffthat is a boolean
expression.
Nowfis satisfiable if and only if the following system is satisfiable:

(16) yg=yg′∨yg′′ (ifg=g′∨g′′),
yg=yg′∧yg′′ (ifg=g′∧g′′),
yg=¬yg′ (ifg=¬g′),
yf= 1.

Nowyg = yg′∨yg′′ can be equivalently expressed by: yg∨¬yg′ = 1, yg∨¬yg′′ =
1 ,¬yg∨yg′∨yg′′ = 1. Similarly,yg = yg′∧yg′′ can be equivalently expressed by:
¬yg∨yg′ = 1,¬yg∨yg′′ = 1, yg∨ ¬yg′∨ ¬yg′′ = 1. The expression yg = ¬yg′ is
equivalent to:yg∨yg′= 1,¬yg∨¬yg′= 1.
By renaming variables, we thus obtain wordsw 1 ,... , wkinB 2 , so thatfis satis-
fiable if and only if the wordw 1 ∧.. .∧wkis satisfiable.

We next derive that thepartition problemPARTITION is NP-complete. This is
the problem: Given a collectionCof subsets of a finite setX, is there a subcollection
ofCthat forms a partition ofX?

Corollary 6.1d. The partition problemPARTITIONisNP-complete.

Proof. We give a polynomial-time reduction of 3-SAT to PARTITION. Let f =
w 1 ∧.. .∧wkbe a word inB 3 , wherew 1 ,... , wkare words inB 2. Letx 1 ,... , xmbe the
variables occurring inf. Make a bipartite graphGwith colour classes{w 1 ,... , wk}
and{x 1 ,... , xm}, by joiningwiandxjby an edge if and only ifxjor¬xjoccurs in
wi. LetXbe the set of all vertices and edges ofG.
LetC′be the collection of all sets{wi}∪E′, whereE′is a nonempty subset of the


Section 6.9. NP-completeness of some other problems 107

edge set incident withwi. LetC′′be the collection of all sets{xj}∪E′jand{xj}∪Ej′′,
whereEj′is the set of all edges{wi, xj}so thatxj occurs inwiand whereEj′′is the
set of all edges{wi, xj}so that¬xjoccurs inwi.
Nowf is satisfiable if and only if the collectionC′∪C′′contains a subcollection
that partitionsX. Thus we have a reduction of 3-SAT to PARTITION.

We derive the NP-completeness of the directed Hamiltonian cycle problemDI-
RECTED HAMILTONIAN CYCLE: Given a directed graph, does it have a directed
Hamiltonian cycle?

Corollary 6.1e. DIRECTED HAMILTONIAN CYCLEisNP-complete.

Proof.We give a polynomial-time reduction of PARTITION to DIRECTEDHAMIL-
TONIAN CYCLE. LetC ={C 1 ,... , Cm}be a collection of subsets of the setX=
{x 1 ,... , xk}. Introduce ‘vertices’r 0 , r 1 ,... , rm, s 0 , s 1 ,... , sk.
For eachi= 1,... , mwe do the following. LetCi={xj 1 ,... , xjt}. We construct a
directed graph on the verticesri− 1 , ri,sjh− 1 , sjh(forh= 1,... , t) and 3tnew vertices,
as in Figure 6.3. Moreover, we make arcs fromrmtos 0 and fromsktor 0.

```
s
```
```
-1
```
```
j jt-1 s
```
```
r
i
```
```
t -1
```
```
r
```
```
j 2
```
```
i
```
```
j j 1 -1
s s j
t-1 jt-1-1 s 2
s s
1 j
```
```
s
```
```
Figure 6.3
```
LetDbe the directed graph arising. Then it is not difficult to checkthat there
exists a subcollectionC′ofCthat partitionsXif and only ifDhas a directed Hamil-
tonian cycleC. (Take: (ri− 1 , ri)∈C⇐⇒Ci∈C′.)

From this we derive the NP-completeness of theundirected Hamiltonian cycle
problemUNDIRECTED HAMILTONIAN CYCLE: Given a graph, does it have a
Hamiltonian cycle?

Corollary 6.1f. UNDIRECTED HAMILTONIAN CYCLEisNP-complete.

Proof.We give a polynomial-time reduction of DIRECTED HAMILTONIAN CY-
CLE to UNDIRECTED HAMILTONIAN CYCLE. LetDbe a directed graph. Re-
place each vertexvby three verticesv′, v′′, v′′′, and make edges{v′, v′′}and{v′′, v′′′}.
Moreover, for each arc (v 1 , v 2 ) ofD, make an edge{v 1 ′, v′′′ 2 }. This makes the undi-
rected graphG. One easily checks thatDhas a directed Hamiltonian cycle if and


108 Chapter 6. Problems, algorithms, and running time

only ifGhas an (undirected) Hamiltonian cycle.

This trivially implies the NP-completeness of thetraveling salesman problemTSP:
Given a complete graphG= (V, E), a ‘length’ functionlonE, and a rationalr, does
there exist a Hamiltonian cycle of length at mostr?

Corollary 6.1g. The traveling salesman problemTSPisNP-complete.

Proof. We give a polynomial-time reduction of UNDIRECTED HAMILTONIAN
CYCLE to TSP. LetGbe a graph. LetG′be the complete graph onV. Letl(e) := 0
for each edgeeofGand letl(e) := 1 for each edge ofG′that is not an edge ofG.
ThenGhas a Hamiltonian cycle if and only ifG′has a Hamiltonian cycle of length
at most 0.

#### 6.10. Turing machines

In Section 6.4 we gave a definition of ‘algorithm’. How adequate is this definition?
Can any computer program be modelled after that definition?

To study this question, we need to know what we understand by a‘computer’.
Turing [1937] gave the following computer model, now calledaTuring machineor a
one-tape Turing machine.
A Turing machine consists of a ‘processor’ that can be in a finite number of ‘states’
and of a ‘tape’, of infinite length (in two ways). Moreover, there is a ‘read-write head’,
that can read symbols on the tape (one at a time). Depending onthe state of the
processor and the symbol read, the processor passes to another (or the same) state,
the symbol on the tape is changed (or not) and the tape is movedone position ‘to
the right’ or ‘to the left’.

The whole system can be described by just giving the dependence mentioned in
the previous sentence. So, mathematically, aTuring machineis just a function

###### (17) T:M×Σ→M×Σ×{+1,− 1 }.

HereM and Σ are finite sets:M is interpreted as the set of states of the processor,
while Σ is the set of symbols that can be written on the tape. The function T
describes an ‘iteration’: T(m, σ) = (m′, σ′,+1) should mean that if the processor is
in statemand the symbol read on the tape isσ, then the next state will bem′, the
symbolσis changed to the symbolσ′and the tape is moved one position to the right.
T(m, σ) = (m′, σ′,−1) has a similar meaning — now the tape is moved one position
to the left.

Thus if the processor is in statemand has the word w′α′σα′′w′′on the tape,
where the symbol indicated byσis read, and ifT(m, σ) = (m′, σ′,+1), then next the


Section 6.10. Turing machines 109

processor will be in statem′ and has the wordw′α′σ′α′′w′′on the tape, where the
symbol indicated byα′′is read. Similarly ifT(m, σ) = (m′, σ′,−1).

We assume thatM contains a certain ‘start state’ 0 and a certain ‘halting state’
∞. Moreover, Σ is assumed to contain a symbol meaning ‘blank’. (This is necessary
to identify the beginning and the end of a word on the tape.)
We say that the Turing machineTacceptsa wordw∈(Σ\{})∗if, when starting
in state 0 and with wordw on the tape (all other symbols being blank), so that
the read-write head is reading the first symbol ofw, then after a finite number of
iterations, the processor is in the halting state ∞. (If w is the empty word, the
symbol read initially is the blank symbol .)
Let Π be the set of words accepted byT. So Π is a problem. We say thatTsolves
Π. Moreover, we say thatT solvesΠin polynomial timeif there exists a polynomial
p(x) such that ifT accepts a wordw, it acceptswin at mostp(size(w)) iterations.
It is not difficult to see that the concept of algorithm defined in Section 6.4 above
is at least as powerful as that of a Turing machine. We can encode any state of the
computer model (processor+tape+read-write head) by a word(w′, m, w′′). Heremis
the state of the processor andw′w′′is the word on the tape, while the first symbol of
w′′is read. We define an algorithmAby:

(18) replace subword, m, σbyσ′, m′, wheneverT(m, σ) = (m′, σ′,+1) andm 6 =
∞;
replace subwordα, m, σbym′, ασ′, wheneverT(m, σ) = (m′, σ′,−1) and
m 6 =∞.

To be precise, we should assume here that the symbols indicating the states inM
do not belong to Σ. Moreover, we assume that the symbols ( and )are not in Σ.
Furthermore, to give the algorithm a start, it contains the tasks of replacing subword
αby the word (, 0 , α , and subwordα byα) (for anyαin Σ\{}). Then, when
starting with a wordw, the first two iterations transform it to the word (, 0 , w). After
that, the rules (18) simulate the Turing machine iterations. The iterations stop as
soon as we arrive at state∞.

SoTaccepts a wordwif and only ifAacceptsw— in (about) the same number
of iterations. That is,T solves a problem Π (in polynomial time) if and only ifA
solves Π (in polynomial time).
This shows that the concept of ‘algorithm’ defined in Section6.4 is at least as
powerful as that of a Turing machine. Conversely, it is not hard (although technically
somewhat complicated) to simulate an algorithm by a Turing machine. But how
powerful is a Turing machine?

One could think of several objections against a Turing machine. It uses only one
tape, that should serve both as an input tape, and as a memory,and as an output
tape. We have only limited access to the information on the tape (we can shift only
one position at a time). Moreover, the computer program seems to be implemented in


110 Chapter 6. Problems, algorithms, and running time

the ‘hardware’ of the computer model; the Turing machine solves only one problem.
To counter these objections, several other computer modelshave been proposed
that model a computer more realistically: multi-tape Turing machines, random access
machines (RAM’s), the universal Turing machine. However, from a polynomial-time
algorithmic point of view, these models all turn out to be equivalent. Any problem
that can be solved in polynomial time by any of these computermodels, can also
be solved in polynomial time by some one-tape Turing machine, and hence by an
algorithm in the sense of Section 6.4. We refer to Aho, Hopcroft, and Ullman [1974]
and Papadimitriou [1994] for an extensive discussion.


###### 111

### 7. Cliques, stable sets, and colourings

##### 7.1. Introduction

```
We have seen in Chapter 5 that in any graphG= (V, E), a matching of maximum
cardinality can be found in polynomial time. Similarly, an edge-cover of minimum
cardinality can be found in polynomial time.
On the other hand, it is NP-complete to find a maximum-cardinality stable set in
a graph. That is, determiningα(G) is NP-complete. To be more precise, the problem
COCLIQUE is:
```
(1) given: a graphGand a natural numberk,
decide: ifα(G)≥k.

```
Then:
```
```
Theorem 7.1. The problemCOCLIQUEisNP-complete.
```
```
Proof. We reduce SAT to COCLIQUE. Let C 1 ∧ ··· ∧Ck be a boolean expres-
sion in the variablesx 1 ,... , xn, where each expression is a disjunction of theliterals
x 1 ,¬x 1 ,... , xn,¬xn. Consider the graphG= (V, E) withV :={(σ, i)|σis a literal
inCi}andE:={{(σ, i),(τ, j)}|i=jorσ=¬τ}. Then the expression is satisfiable
if and only ifGhas a stable set of sizek.
```
```
Since by Gallai’s theorem Theorem 3.1,α(G) =|V|−τ(G), also determining the
vertex-cover numberτ(G) is NP-complete.
Acliquein a graphG= (V, E) is a subsetCofV such thatuandware adjacent
for any two distinctu, w inC. Theclique numberof G, denoted byω(G), is the
maximum cardinality of any clique inG.
Observe that a subsetCofV is a clique inGif and only ifCis a stable set in the
complementary graphG. So finding a maximum-cardinality clique inGis equivalent
to finding a maximum-cardinality stable set inG, andω(G) =α(G). As determining
α(G) is NP-complete, also determiningω(G) is NP-complete.
A(vertex-)colouringof a graph G= (V, E) is a partition ofV into stable sets
C 1 ,... , Ck. The setsC 1 ,... , Ckare called thecoloursof the colouring. The(vertex-
) colouring number, or (vertex-)chromatic number, of G, denoted byχ(G), is the
minimum number of colours in any vertex-colouring ofG. A graphGis calledk-
colourableifχ(G)≤k. Again, it is NP-complete to decide if a graph isk-colourable.
That is, let VERTEX-COLOURING be the problem:
```

```
112 Chapter 7. Cliques, stable sets, and colourings
```
(2) given: a graphGand a natural numberk,
decide: ifχ(G)≤k.

```
Theorem 7.2.The problemVERTEX-COLOURINGisNP-complete.
```
```
Proof.We show that COCLIQUE can be reduced to VERTEX-COLOURING. Let
G= (V, E) be an undirected graph and letk∈Z+. We want to decide ifα(G)≥k.
To this end, letV′be a copy ofV and letCbe a set of sizek, whereV,V′, andC
are disjoint. Make a graphHwith vertex setV∪V′∪Cas follows. A pair of vertices
inV is adjacent inHif and only if it is adjacent inG. The setsV′andCare cliques
inH. Each vertex inV is adjacent to each vertex inV′∪C, except to its copy inV′.
No vertex inV′is adjacent to any vertex inC.
This defines the graphH. Thenα(G)≥kif and only ifχ(H)≤|V|+ 1.
```
```
Well-known is thefour-colour conjecture(4CC), stating thatχ(G)≤4 for each
planar graphG. This conjecture was proved by Appel and Haken [1977] and Appel,
Haken, and Koch [1977], and is now called thefour-colour theorem(4CT).
In fact, it is NP-complete to decide if a planar graph is 3-colourable. [Note that
one can decide in polynomial time if a graphGis 2-colourable, as bipartiteness can
be checked in polynomial time.]
These NP-completeness results imply that if NP 6 =co-NP, then one may not ex-
pect a min-max relation characterizing the stable set numberα(G), the vertex-cover
numberτ(G), the clique numberω(G), or the colouring numberχ(G) of a graphG.
There is a trivial upper bound on the colouring number:
```
```
(3) χ(G)≤∆(G) + 1,
```
```
where ∆(G) denotes the maximum valency ofG. Brooks [1941] sharpened this in-
equality as follows:
```
```
Theorem 7.3(Brooks’ theorem).For any connected graphGone hasχ(G)≤∆(G),
except ifG=KnorG=C 2 n+1for somen≥ 1.^19
```
```
Another inequality relates the clique number and the colouring number:
```
```
(4) ω(G)≤χ(G).
```
```
This is easy, since in any clique all vertices should have different colours.
But there are several graphs which have strict inequality in(4). We mention
the odd circuits C 2 k+1, with 2k+ 1 ≥ 5: thenω(C 2 k+1) = 2 and χ(C 2 k+1) = 3.
```
(^19) HereCkdenotes the circuit withkvertices.


Section 7.1. Introduction 113

Moreover, for the complementC 2 k+1of any such graph we have: ω(C 2 k+1) =kand
χ(C 2 k+1) =k+ 1.
It was a conjecture of Berge [1963] that these graphs are crucial, which was proved
in 2002 by Chudnovsky, Robertson, Seymour, and Thomas:^20

Strong perfect graph theorem: Let Gbe a graph. If ω(G)< χ(G) thenG
containsCnorCn, for some oddn≥5, as aninducedsubgraph.

Another conjecture is due to Hadwiger [1943]. Since there exist graphs with
ω(G)< χ(G), it is not true that ifχ(G)≥nthenGcontains the complete graph
Knonnvertices as a subgraph. However, Hadwiger conjectured the following, where
a graphHis called aminorof a graphGifHarises from some subgraph ofGby
contracting some (possible none) edges.

Hadwiger’s conjecture: Ifχ(G)≥nthenGcontainsKnas a minor.

In other words, for eachn, the graphKnis the only graphGwith the property that
Gis not (n−1)-colourable and each proper minor ofGis (n−1)-colourable.
Hadwiger’s conjecture is trivial forn= 1, 2 ,3, and was shown by Hadwiger for
n= 4 (see Exercise 7.8). As planar graphs do not containK 5 as a minor, Hadwiger’s
conjecture forn= 5 implies the four-colour theorem. In fact, Wagner [1937] showed
that Hadwiger’s conjecture for n = 5 is equivalent to the four-colour conjecture.
Recently, Robertson, Seymour, and Thomas [1993] showed that Hadwiger’s conjecture
is true also forn= 6, by showing that in that case it is equivalent to the four-colour
theorem. Forn≥7 Hadwiger’s conjecture is unsettled.

Application 7.1: Map colouring.A well-known application of colouring the vertices of
a graph is that of colouring the countries in a map in such a waythat adjacent countries
obtain different colours. So the four-colour theorem implies that if each country is connected,
then the map can be coloured using not more than four colours.(One should not consider
countries as ‘adjacent’ if they have a common boundary of measure 0 only.)
There are several other cases where colouring a map amounts to finding a minimum
vertex-colouring in a graph. For instance, consider a map of the Paris M ́etro network
(Figure 7.1).
Suppose now that you want to print a coloured map of the network, indicating each of
the 13 lines by a colour, in such a way that lines that cross each other or meet each other
in a station, are indicated by different colours and in such a way that a minimum number
of colours is used. This easily reduces to a graph colouring problem.

Application 7.2: Storage of goods, etc. Suppose you are the director of a circus and
wish to transport your animals in a number of carriages, in such a way that no two of the
animals put into one carriage eat each other, and in such a waythat you use a minimum

(^20) LetG= (V,E) be a graph and letV′⊆V. Then the subgraph ofGinduced byV′, denoted by
G|V′is the graph (V′,E′), whereE′equals the set of all edges inEcontained inV′. The graph
G|V′is called aninducedsubgraph ofG.


114 Chapter 7. Cliques, stable sets, and colourings

```
1
```
```
2
```
```
3
```
```
3
```
```
4
```
```
4
```
```
5
```
```
5
```
```
6
```
```
2
```
```
7
```
```
7
```
```
13
12
```
```
11
```
```
9
```
```
10
```
```
12
13
```
```
8
7
```
```
13
```
```
10
9 1
8
```
```
6
```
```
11
```
```
1
```
```
10
12
```
```
11
13
```
```
8
9
```
```
2 3 4 5 6 7
```
```
Figure 7.1.The Paris M ́etro lines
```
number of carriages.
This trivially reduces to a graph colouring problem. A similar problem is obtained if
you have to store a number of chemicals in a minimum number of rooms of a storehouse,
in such a way that no two of the chemicals stored in one room react upon each other in an
unwanted way.
This problem may also occur when assigning multiple-bed rooms to school boys on a
school trip.

Application 7.3: Assigning frequencies to radio stations, car phones, etc.Suppose
one has to assign frequencies to radio stations in a certain area. Certain pairs of radio
stations that are too close to each other cannot be assigned the same frequency as it would
cause mutual interference. Such pairs of radio stations form the edge set of a graphG, with
vertex set the set of radio stations. The chromatic number ofGis equal to the minimum
number of different frequencies that one needs in order to assign a frequency to each of the
stations.
The problem occurs also when assigning frequencies to car phones, where often in a very
short time new frequencies should be determined.

Exercises


Section 7.2. Edge-colourings of bipartite graphs 115

```
7.1. Determineω(G) andχ(G) for the graphGobtained from the Paris M ́etro map given
in Application 7.1.
```
```
7.2. Colour the map of Figure 7.2 (from the April 1975 issue ofScientific American).
```
```
Figure 7.2
```
```
7.3. Show that ifGis a bipartite graph, thenω(G) =χ(G).
7.4. Derive from K ̋onig’s edge cover theorem (Corollary 3.3a) that ifGis the complement
of a bipartite graph, thenω(G) =χ(G).
```
```
7.5. Derive K ̋onig’s edge cover theorem (Corollary 3.3a) from the strong perfect graph
theorem.
```
```
7.6. LetH be a bipartite graph and letGbe the complement of the line-graph ofH.
Derive from K ̋onig’s matching theorem (Theorem 3.3) thatω(G) =χ(G).
7.7. Derive K ̋onig’s matching theorem (Theorem 3.3) from the strong perfect graph the-
orem.
7.8. LetG= (V,E) be a simple graph such that no minor ofGis isomorphic toK 4. Show
thatχ(G)≤3.
[Hint:One may assume thatGis not a forest or a circuit. ThenGhas a circuit not
covering all vertices ofG. AsGhas noK 4 -minor,Gis not 3-connected, that is,G
has a vertex cut set of size less than 3; thenχ(G)≤3 follows by induction.]
```
##### 7.2. Edge-colourings of bipartite graphs

For any graphG= (V, E), anedge-colouringis a partition Π ={M 1 ,... , Mp}of the
edge setE, where eachMiis a matching. Each of these matchings is called acolour.


116 Chapter 7. Cliques, stable sets, and colourings

Define theedge-colouring numberoredge-chromatic numberχ′(G) by

(5) χ′(G) := min{|Π||Π is an edge-colouring ofG}.

Soχ′(G) =χ(L(G)), whereL(G) is the line graph ofG.
Let ∆(G) denote the maximum degree of (the vertices of)G. Clearly,

(6) χ′(G)≥∆(G),

since at each vertexv, the edges incident withvshould have different colours. Again
the triangleK 3 has strict inequality. K ̋onig [1916] showed that for bipartite graphs
the two numbers are equal.

Theorem 7.4(K ̋onig’s edge-colouring theorem).For any bipartite graphG= (V, E)
one has

(7) χ′(G) = ∆(G).

That is, the edge-colouring number of a bipartite graph is equal to its maximum de-
gree.

Proof.First notice that the theorem is easy if ∆(G)≤2. In that case,Gconsists of
a number of vertex-disjoint paths and even circuits.
In the general case, colour as many edges ofGas possible with ∆(G) colours,
without giving the same colour to two intersecting edges. Ifall edges are coloured we
are done, so suppose some edgee={u, w}is not coloured. At least one colour, say
red, does not occur among the colours given to the edges incidentwithu. Similarly,
there is a colour, sayblue, not occurring atw. (Clearly,red 6 =blue, since otherwise we
could give edgeethe colourred.)
LetHbe the subgraph ofGhaving as edges allredandblueedges ofG, together
with the edgee. Now ∆(H) = 2, and hence χ′(H) = ∆(H) = 2. So all edges
occurring inHcan be (re)coloured withredandblue. In this way we colour more
edges ofGthan before. This contradicts the maximality assumption.

This proof also gives a polynomial-time algorithm to find an edge-colouring with
∆(G) colours.

We remark here that Vizing [1964] proved that for general simple graphsGone
has

(8) ∆(G)≤χ′(G)≤∆(G) + 1.

Here ‘simple’ cannot be deleted, as is shown by the graphGwith three vertices, where


Section 7.2. Edge-colourings of bipartite graphs 117

any two vertices are connected by two parallel edges: then ∆(G) = 4 whileχ′(G) = 6.

A theorem ‘dual’ to K ̋onig’s edge-colouring theorem was also shown by K ̋onig.
Note that the edge-colouring numberχ′(G) of a graphGis the minimum number of
matchings needed to cover the edges of a bipartite graph. Dually, one can define:

(9) ξ(G) := the maximum number of pairwise disjoint edge covers inG.

So, in terms of colours,ξ(G) is the maximum number of colours that can be used in
colouring the edges ofGin such a way that at each vertex all colours occur. Hence,
ifδ(G) denotes the minimum degree ofG, then

(10) ξ(G)≤δ(G).

The triangleK 3 again is an example having strict inequality. For bipartitegraphs
however:

Corollary 7.4a. For any bipartite graphG= (V, E)one has

(11) ξ(G) =δ(G).

That is, the maximum number of pairwise disjoint edge coversis equal to the minimum
degree.

Proof.One may derive fromGa bipartite graphH, each vertex of which has degree
δ(G) or 1, by repeated application of the following procedure:

(12) for any vertexvof degree larger thanδ(G), add a new vertexu, and replace
one of the edges incident withv,{v, w}say, by{u, w}.

So there is a one-to-one correspondence between the edges ofthe final graphHand
the edges ofG. SinceHhas maximum degreeδ(G), by Theorem 7.4 the edges ofH
can be coloured withδ(G) colours such that no two edges of the same colour intersect.
So at any vertex ofHof degreeδ(G) all colours occur. This gives a colouring of the
edges ofGwithδ(G) colours such that at any vertex ofGall colours occur.

Application 7.4: Scheduling classes.Suppose we havenclasses andmteachers. In the
following scheme it is indicated by an X which classes shouldbe taught by which teachers
(one lesson of one hour a day):


118 Chapter 7. Cliques, stable sets, and colourings

```
class: 1 2 3 4 5 6
teacher:a X X X
b X X X X
c X X X
d X X
e X X X X
f X X X X
g X X X X
```
The question is: What is the minimum timespan in which all lessons can be scheduled?

Theorem 7.4 tells us that all lessons can be scheduled withina timespan of 4 hours.
Indeed, make a bipartite graphGwith colour classesT := set of teachers andC:= set of
classes, wheret∈T andc∈Care connected if and only if teachertshould teach classc;
that is, if there is an X in position (t,c) in the scheme.

In the above exampleGwill have maximum degree ∆(G) equal to 4. Hence according to
Theorem 7.4, the edge-colouring numberχ′(G) ofGis also equal to 4. So we can colour the
edges ofGby 4 colours so that no two edges of the same colour have a vertex in common.
That is, we can colour the X’s in the scheme by 4 colours so thatthere are no two crosses
of the same colour in any row or column. If every colour represent one hour, we obtain a
schedule spanning 4 hours.

This application can be extended to the case where teachers can give more than one
lesson a day to a class. In that case we obtain a bipartite graph with multiple edges.

For anyk-edge-colouring of a graphG= (V,E), we can assume that any two colours
differ by at most 1 in size (if they differ more, one can exchangethe two colours on one of the
path components of the union of the two colours, to bring their cardinalities closer together).
That is, each colour has size⌊|E|/k⌋or⌈|E|/k⌉. It implies that there is a schedule in which
no more than⌈|E|/k⌉lessons are scheduled simultaneously. So the number of classrooms
needed is⌈|E|/k⌉, which is clearly best possible if we want to schedule|E|lessons withink
hours.

Exercises

```
7.9. Determine a schedule for the following scheduling problems:
```
```
(i)
```
```
X X X X
X X X X
X X X X
X X X X
X X X X
```

Section 7.2. Edge-colourings of bipartite graphs 119

```
(ii)
```
```
X X X X
X X X X
X X X X
X X X X
X X X X
X X X X
X X X X
```
```
(iii)
```
```
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
```
```
J L R S T W X Z
```
```
V
```
```
U
```
```
Q
```
```
P
```
```
O
```
```
M
N
```
```
K
```
```
I
```
```
G
H
```
```
F
```
```
E
```
```
C
D
```
```
B
```
```
A
```
```
Y
```
```
(Here the slots to be scheduled are indicated by open cells.)
```

120 Chapter 7. Cliques, stable sets, and colourings

```
7.10. Let Gbe the line-graph of some bipartite graph H. Derive from K ̋onig’s edge-
colouring theorem (Theorem 7.4) thatω(G) =χ(G).
```
```
7.11. Derive K ̋onig’s edge-colouring theorem (Theorem 7.4) from the strong perfect graph
theorem.
```
```
7.12. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be partitions of a finite setXsuch that
|A 1 |=···=|An|=|B 1 |=···=|Bn|=k. Show thatAandBhavekpairwise
disjoint common transversals.
```
```
7.13. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be families of subsets of a finite setX.
```
```
(i) Letk∈N. Suppose thatXcan be partitioned intokpartial SDR’s ofA, and
thatXalso can be partitioned intokpartial SDR’s ofB. Derive thatXcan be
partitioned intokcommonpartial SDR’s forAandB.
(ii) Show that the minimum number of common partial SDR’s ofAandBneeded
to coverXis equal to
```
```
(13) ⌈max
Y⊆X
```
```
max{
|Y|
|{i|Ai∩Y 6 =∅}|
```
```
,
|Y|
|{i|Bi∩Y 6 =∅}|
```
```
}⌉.
```
```
(Hint:Use Exercise 3.8.)
```
```
7.14. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be families of subsets of a finite setX
and letk∈N. Suppose thatXhas a partition (Y 1 ,...,Yk) such that eachYiis an
SDR ofA. Suppose moreover thatXhas a partition (Z 1 ,...,Zk) such that eachZi
is an SDR ofB. Derive thatXhas a partition (X 1 ,...,Xk) such that eachXiis an
SDR both ofAand ofB.
7.15. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be families of subsets of a finite setX
and letk∈N. Suppose thatXhas a partition (Y 1 ,...,Yn) such that|Yi|=kand
Yi⊆Aifori= 1,...,n. Suppose moreover thatXhas a partition (Z 1 ,...,Zn) such
that|Zi|=kandZi⊆Bifori= 1,...,n. Derive thatXhas a partition (X 1 ,...,Xk)
such that eachXiis an SDR both ofAand ofB.
```
```
7.16. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bm) be families of subsets of a finite set and
letkbe a natural number. Prove thatAandBhavekpairwise disjoint common
SDR’s if and only if for allI,J⊆{ 1 ,...,n}:
```
```
(14)
```
```
∣
∣
```
```
⋃
```
```
i∈I
```
```
Ai∩
```
```
⋃
```
```
j∈J
```
```
Bj
```
```
∣
∣≥k(|I|+|J|−n).
```
```
(Hint:Use Exercise 7.15.)
7.17. LetA= (A 1 ,...,An) andB= (B 1 ,...,Bn) be families of subsets of a finite setX.
```
```
(i) Letk∈ N. Suppose thatAhaskpairwise disjoint SDR’s and that alsoB
haskpairwise disjoint SDR’s. Derive thatXcan be partitioned intoksubsets
X 1 ,...,Xksuch that eachXicontains an SDR ofAand contains an SDR ofB.
```

```
Section 7.3. Partially ordered sets 121
```
```
(ii) Show that the maximum numberkfor which there exists a partition as in (i) is
equal to
```
```
(15) ⌊ min
∅6=I⊆{ 1 ,...,n}
```
```
min{
```
```
∣
∣⋃i∈IAi
∣
∣
|I|
```
```
,
```
```
∣
∣⋃i∈IBi
∣
∣
|I|
```
```
}⌋.
```
```
(Hint:Use Exercise 3.7.)
```
##### 7.3. Partially ordered sets

```
Apartially ordered setis a pair (X,≤) whereXis a set and where≤is a relation on
Xsatisfying (for allx, y, z∈X):
```
(16) (i)x≤x;
(ii) ifx≤yandy≤xthenx=y;
(iii) ifx≤yandy≤zthenx≤z.

```
A subsetCofXis called achainif for allx, y∈Cone hasx≤yory≤x. A subset
AofXis called anantichainif for allx, y∈Awithx 6 =yone hasx6≤yandy6≤x.
Note that ifCis a chain andAis an antichain then
```
###### (17) |C∩A|≤ 1.

```
First we observe the following easy min-max relation:
```
```
Theorem 7.5. Let(X,≤)be a partially ordered set, withXfinite. Then the mini-
mum number of antichains needed to coverXis equal to the maximum cardinality of
any chain.
```
```
Proof.The fact that the maximum cannot be larger than the minimum follows easily
from (17). To see that the two numbers are equal, define for anyelementx∈Xthe
heightofxas the maximum cardinality of any chain inXwith maximumx. For any
i∈N, letAidenote the set of all elements of heighti.
Letkbe the maximum height of the elements ofX. ThenA 1 ,... , Akare antichains
coveringX, and moreover there exists a chain of sizek.
```
```
Dilworth [1950] proved that the same theorem also holds whenwe interchange the
words ‘chain’ and ‘antichain’:
```
```
Theorem 7.6(Dilworth’s decomposition theorem).Let(X,≤)be a partially ordered
set, withXfinite. Then the minimum number of chains needed to coverXis equal
to the maximum cardinality of any antichain.
```

122 Chapter 7. Cliques, stable sets, and colourings

Proof.We apply induction on|X|. The fact that the maximum cannot be larger than
the minimum follows easily from (17). To see that the two numbers are equal, letα
be the maximum cardinality of any antichain and letAbe an antichain of cardinality
α. Define

(18) A↓:={x∈X|∃y∈A:x≤y},
A↑:={x∈X|∃y∈A:x≥y}.

ThenA↓∪A↑=X(sinceAis a maximum antichain) andA↓∩A↑=A.
First assumeA↓ 6 =XandA↑ 6 =X. Then by inductionA↓can be covered withα
chains. SinceA⊆A↓, each of these chains contains exactly one element inA. For
eachx∈A, letCxdenote the chain containingx. Similarly, there existαchainsCx′
(forx∈A) coveringA↑, whereCx′ containsx. Then for eachx∈A,Cx∪Cx′ forms a
chain inX, and moreover these chains coverX.
So we may assume that for each antichainAof cardinalityαone hasA↓=Xor
A↑=X. It means that each antichainAof cardinalityαis either the set of minimal
elements ofXor the set of maximal elements ofX. Now choose a minimal element
xand a maximal elementyofXsuch thatx≤y. Then the maximum cardinality of
an antichain inX\{x, y}is equal toα−1 (since each antichain inXof cardinalityα
containsxory). By induction,X\{x, y}can be covered withα−1 chains. Adding
the chain{x, y}yields a covering ofXwithαchains.

Application 7.5: Project scheduling.Suppose you have to perform a project consisting
of several jobs. Each job takes one time-unit, say one hour. Certain jobs have to be done
before other jobs; this relation is given by a partial order on the jobs. Assuming that you
have sufficient workers, the time required to finish the project is equal to the sizeγof the
longest chain. Indeed, by Theorem 7.5, the jobs can be split intoγantichainsA 1 ,...,Aγ;
in fact, these antichains can be chosen such that ifx∈Aiandy∈Ajandx < ytheni < j.
As in each of these antichains, the jobs can be done simultaneously, we obtain a feasible
schedule.
This is an application quite similar to PERT-CPM (Application 1.4).

Application 7.6: Bungalow assignment.Suppose you are the manager of a bungalow
park, with bungalows that can be rented out during the holiday season. There have been
made a number of reservations, each for a connected period ofsome weeks, like in Figure
7.3. If the number of reservations during any of the weeks in the holiday season is not larger
than the total number of bungalows available, then there exists an allocation of customers to
bungalows, in such a way that no renter has to switch bungalows during his/her stay. This
rule well-known to bungalow park managers, is a special caseof Dilworth’s decomposition
theorem.
Indeed, one can make a partial order as follows. LetXbe the set of reservations made,
and for anyx,y∈Xletx < yif the last day for reservationxis earlier than or equal to
the first day of reservationy.
Then the maximum size of any antichain of (X,≤) is equal to the maximum numbern


Section 7.3. Partially ordered sets 123

```
Figure 7.3
```
of reservations made for any week in the season. By Dilworth’s decomposition theorem,X
can be split intonchains. Each chain now gives a series of reservations that can be assigned
to one and the same bungalow.
A similar problem occurs when assigning hotel rooms to hotelguests.

Application 7.7: Terminal and platform assignment.A similar problem as in Appli-
cation 7.6 occurs when one has to assign airplanes to terminals at an airport, or trains or
buses to platforms in a train or bus station. The model has to be adapted however, if one
requires aperiodicassignment; this occurs for instance if the trains or buses run a periodic
timetable, say with period one hour.

Exercises

```
7.18. Let (X,≤) be a partially ordered set. Call a chainmaximal if it is not contained
in any other chain. Prove that the maximum number of pairwisedisjoint maximal
chains is equal to the minimum cardinality of a set intersecting all maximal chains.
```
```
7.19. Derive K ̋onig’s edge cover theorem from Dilworth’s decomposition theorem.
```
```
7.20. LetG= (V,E) be a bipartite graph, with colour classesV 1 andV 2 , with|V 1 |=|V 2 |=
n. Letkbe a natural number. Derive from Dilworth’s decomposition theorem that
the edges ofGcan be covered bykperfect matchings if and only if for each vertex
coverW⊆V the number of edges contained inWis at mostk(|W|−n).
```
```
7.21. LetI= (I 1 ,...,In) be a family of intervals onR, in such a way that eachx∈R
is contained in at mostkof these intervals. Show thatIcan be partitioned intok
classesI 1 ,...,Ikso that eachIjconsists of pairwise disjoint intervals.
```
```
7.22. LetD= (V,A) be an acyclic directed graph and letsandtbe vertices ofDsuch that
each arc ofDoccurs in at least ones−tpath. Derive from Dilworth’s decomposition
theorem that the minimum number ofs−tpaths needed to cover all arcs is equal to
the maximum cardinality ofδout(U), whereUranges over all subsets ofV satisfying
s∈U,t6∈Uandδin(U) =∅.
```

124 Chapter 7. Cliques, stable sets, and colourings

```
7.23. A graphG= (V,E) is called acomparability graphif there exists a partial order≤
onV such that for allu,winV withu 6 =wone has:
```
```
(19) {u,w}∈E⇔u≤worw≤u.
```
```
(i) Show that ifGis a comparability graph, thenω(G) =χ(G).
(ii) Show that ifGis the complement of a comparability graph, thenω(G) =χ(G).
(Hint:Use Dilworth’s decomposition theorem (Theorem 7.6).)
```
```
7.24. Let (X,≤) be a partially ordered set, withXfinite. LetCandAdenote the collections
of chains and antichains in (X,≤), respectively. Letw :X → Z+be a ‘weight’
function.
```
```
(i) Show that the maximum weightw(C) of any chain is equal to the minimum value
of
```
```
∑
A∈Aλ(A), where theλ(A) range over all nonnegative integers satisfying
```
```
(20)
```
```
∑
```
```
A∈A,x∈A
```
```
λ(A) =w(x)
```
```
for eachx∈X.
(ii) Show that the maximum weightw(A) of any antichain is equal to the mini-
mum value of
```
```
∑
C∈Cλ(C), where theλ(C) range over all nonnegative integers
satisfying
```
```
(21)
```
```
∑
```
```
C∈C,x∈C
```
```
λ(C) =w(x)
```
```
for eachx∈X.
(iii) Derive that the convex hull of the incidence vectors ofantichains (as vectors in
RX) is equal to the set of all vectorsf∈RX+satisfyingf(C)≤1 for each chain
C.
[For any finite setXand any subsetYofX, define theincidence vectorχY ∈RX
ofY as:
```
```
(22)
χYx := 1 ifx∈Y;
:= 0 ifx6∈Y.]
```
```
(iv) Derive also that the convex hull of the incidence vectors of chains (as vectors
inRX) is equal to the set of all vectorsf ∈RX+ satisfyingf(A)≤1 for each
antichainA.
```
```
7.25. Derive Dilworth’s decomposition theorem (Theorem 7.6) from the strong perfect
graph theorem.
```

Section 7.4. Perfect graphs 125

##### 7.4. Perfect graphs

We now consider a general class of graphs, the ‘perfect’ graphs, that turn out to unify
several results in combinatorial optimization, in particular, min-max relations and
polyhedral characterizations.
As we saw before, the clique numberω(G) and the colouring numberχ(G) of a
graphG= (V, E) are related by the inequality:

(23) ω(G)≤χ(G).

There are graphs that have strict inequality; for instance, the circuit C 5 on five
vertices.
Having equality in (23) does not say that much about the internal structure of a
graph: any graphG= (V, E) can be extended to a graphG′ = (V′, E′) satisfying
ω(G′) =χ(G′), simply by adding toGa clique of sizeχ(G), disjoint fromV.
However, if we require that equality in (23) holds for each induced subgraph of
G, we obtain a much more powerful condition. The idea for this was formulated by
Berge [1963]. He defined a graphG= (V, E) te beperfectifω(G′) =χ(G′) holds for
each induced subgraphG′ofG.
Several classes of graphs could be shown to be perfect, and Berge [1961,1963]
observed the important phenomenon that for several classesof graphs that were shown
to be perfect, also the class of complementary graphs is perfect. (Thecomplement
or thecomplementary graphGof a graphG= (V, E) is the graph with vertex set
V, where any two distinct vertices inV are adjacent inGif and only if they are
nonadjacent inG.)
Berge therefore conjectured that the complement of any perfect graph is perfect
again. This conjecture was proved by Lov ́asz [1972b], and hisperfect graph theorem
forms the kernel of perfect graph theory. It has several other theorems in graph theory
as consequence. Lov ́asz [1972a] gave the following stronger form of the conjecture,
which we show with the elegant linear-algebraic proof foundby Gasparian [1996].

Theorem 7.7. A graphGis perfect if and only ifω(G′)α(G′)≥ |V(G′)|for each
induced subgraphG′ofG.

Proof.Necessity is easy, since ifGis perfect, thenω(G′) =χ(G′) for each induced
subgraphG′ofG, and sinceχ(G′)α(G′)≥|V(G′)|for any graphG′.
To see sufficiency, suppose to the contrary that there exists an imperfect graphG
satisfying the condition, and choose such a graph with|V(G)|minimal. Soχ(G)>
ω(G), whileχ(G′) =ω(G′) for each induced subgraphG′ 6 =GofG.
Letω:=ω(G) andα:=α(G). We can assume thatV(G) ={ 1 ,... , n}.
We first construct

(24) stable setsC 0 ,... , Cαωsuch that each vertex is covered by exactlyαof the


126 Chapter 7. Cliques, stable sets, and colourings

```
Ci.
```
LetC 0 be any stable set inGof sizeα. By the minimality ofG, we know that for
eachv∈C 0 , the subgraph ofGinduced byV(G)\{v}is perfect, and that hence its
colouring number is at mostω(as its clique number is at mostω); thereforeV(G)\{v}
can be partitioned intoωstable sets. Doing this for eachv∈C 0 , we obtain stable
sets as in (24).

Now for eachi= 0,... , αω, there exists a cliqueKiof sizeωwithKi∩Ci=∅.
Otherwise, the subgraphG′ofGinduced byV(G)\Ciwould haveω(G′)< ω, and
hence it has colouring number at mostω−1. AddingCias a colour would give an
ω-vertex colouring ofG, contradicting the assumption thatχ(G)> ω(G).

Then, ifi 6 =jwith 0≤i, j≤αω, we have|Kj∩Ci|= 1. This follows from the
fact thatKj has sizeωand intersects eachCiin at most one vertex, and hence, by
(24), it intersectsαωof theCi. AsKj∩Cj=∅, we have that|Kj∩Ci|= 1 ifi 6 =j.
Now consider the (αω+ 1)×nincidence matricesM = (mi,j) andN = (ni,j)
ofC 0 ,... , Cαω andK 0 ,... , Kαω respectively. SoM andN are 0,1 matrices, with
mi,j= 1⇔j∈Ci, andni,j= 1⇔j∈Ki, fori= 0,... , αωandj= 1,... , n. By
the above,M NT=J−I, whereJ is the (αω+ 1)×(αω+ 1) all-1 matrix, andIthe
(αω+ 1)×(αω+ 1) identity matrix. AsJ−Ihas rankαω+ 1, we haven≥αω+ 1.
This contradicts the condition given in the theorem.

```
This implies:
```
Corollary 7.7a((Lov ́asz’s) perfect graph theorem). The complement of a perfect
graph is perfect again.

Proof.Directly from Theorem 7.7, as the condition given in it is maintained under
taking the complementary graph.

In fact, Berge [1963] also made an even stronger conjecture,which was proved
in 2002 by Chudnovsky, Robertson, Seymour, and Thomas (we mentioned this in
Section 7.1 in a different but equivalent form):

Strong perfect graph theorem. A graphGis perfect if and only ifGdoes not
contain any odd circuitC 2 k+1withk≥2 or its complement as an induced subgraph.

We now show how several theorems we have seen before follow asconsequences
from the perfect graph theorem. First observe that trivially, any bipartite graphGis
perfect. This implies K ̋onig’s edge cover theorem (Theorem3.3a):

Corollary 7.7b(K ̋onig’s edge cover theorem).The complement of a bipartite graph
is perfect. Equivalently, the edge cover number of any bipartite graph (without isolated
vertices) is equal to its stable set number.


Section 7.4. Perfect graphs 127

Proof.Directly from the perfect graph theorem. Note that ifGis a bipartite graph,
then its cliques have size at most 2; henceχ(G) is equal to the edge cover number of
GifGhas no isolated vertices.
Note moreover that the class of complements of bipartite graphs is closed under
taking induced subgraphs. Hence the second statement in the Corollary indeed is
equivalent to the first.

We saw in Section 3.3 that by Gallai’s theorem (Theorem 3.1),K ̋onig’s edge cover
theorem directly implies K ̋onig’s matching theorem (Theorem 3.3), saying that the
matching number of a bipartite graphGis equal to its vertex cover number. That is,
the stable set number of the line graphL(G) ofGis equal to the minimum number
of cliques ofL(G) that cover all vertices ofL(G). As this is true for any induced
subgraph ofL(G) we know that the complementL(G) of the line graphL(G) of any
bipartite graphGis perfect.
Hence with the perfect graph theorem we obtain K ̋onig’s edge-colouring theorem
(Theorem 7.4):

Corollary 7.7c(K ̋onig’s edge-colouring theorem).The line graph of a bipartite graph
is perfect. Equivalently, the edge-colouring number of any bipartite graph is equal to
its maximum degree.

Proof.Again directly from K ̋onig’s matching theorem and the perfect graph theorem.

We can also derive Dilworth’s decomposition theorem (Theorem 7.6) easily from
the perfect graph theorem. Let (V,≤) be a partially ordered set. LetG= (V, E) be
the graph with:

(25) uv∈Eif and only ifu < vorv < u.

Any graphGobtained in this way is called acomparability graph.
As Theorem 7.5 we saw the following easy ‘dual’ form of Dilworth’s decomposition
theorem:

Theorem 7.8. In any partially ordered set(V,≤), the maximum size of any chain
is equal to the minimum number of antichains needed to coverV.

Proof.For anyv∈V define theheightofvas the maximum size of any chain inV
with maximum elementv. Letkbe the maximum height of any elementv∈V. For
i= 1,... , kletAibe the set of elements of heighti. ThenA 1 ,... , Akare antichains
coveringV, and moreover, there is a chain of sizek, since there is an element of height
k.


128 Chapter 7. Cliques, stable sets, and colourings

Equivalently, we haveω(G) =χ(G) for any comparability graph. As the class of
comparability graphs is closed under taking induced subgraphs we have:

Corollary 7.8a. Any comparability graph is perfect.

Proof.Directly from Theorem 7.8.

```
So by the perfect graph theorem:
```
Corollary 7.8b. The complement of any comparability graph is perfect.

Proof.Directly from Corollary 7.8a and the perfect graph theorem (Corollary 7.7a).

```
That is:
```
Corollary 7.8c (Dilworth’s decomposition theorem). In any partially ordered set
(V,≤), the maximum size of any antichain is equal to the minimum number of chains
needed to coverV.

Proof.Directly from Corollary 7.8b.

A further application of the perfect graph theorem is to ‘chordal graphs’, which
we describe in the next section.
We note here that it was shown with the help of the ‘ellipsoid method’ that
there exists a polynomial-time algorithm for finding a maximum-size clique and a
minimum vertex-colouring in any perfect graph (Gr ̈otschel, Lov ́asz, and Schrijver
[1981]). However no combinatorial polynomial-time algorithm is known for these
problems.

Exercises

```
7.26. Show that the graph obtained from the Paris M ́etro network (see Application 7.1) is
perfect.
```
```
7.27. Show that Theorem 7.7 is implied by the strong perfect graph theorem.
```
##### 7.5. Chordal graphs

We finally consider a further class of perfect graphs, the ‘chordal graphs’ (or ‘rigid
circuit graphs’ or ‘triangulated graphs’). A graphGis calledchordalif each circuit
inGof length at least 4 has a chord. (Achordis an edge connecting two vertices of
the circuit that do not form two neighbours in the circuit.)


Section 7.5. Chordal graphs 129

For any setAof vertices letN(A) denote the set of vertices not inAthat are
adjacent to at least one vertex inA. Call a vertexvsimplicialifN({v}) is a clique
inG.
Dirac [1961] showed the following basic property of chordalgraphs:

Theorem 7.9. Each chordal graphGcontains a simplicial vertex.

Proof. We may assume thatG has at least two nonadjacent verticesa, b. Let A
be a maximal nonempty subset of V such thatG|A is connected and such that
A∪N(A) 6 =V. Such a subsetAexists asG|{a}is connected and{a}∪N({a}) 6 =V.
LetB:=V\(A∪N(A)). Then each vertexvinN(A) is adjacent to each vertex in
B, since otherwise we could increaseAbyv. Moreover,N(A) is a clique, for suppose
that u, w ∈N(A) are nonadjacent. Choose v∈ B. Let P be a shortest path in
A∪N(A) connectinguandw. ThenP∪{u, v, w}would form a circuit of length at
least 4 without chords, a contradiction.
Now inductively we know thatG|Bcontains a vertexvthat is simplicial inG|B.
SinceN(A) is a clique and since each vertex inBis connected to each vertex inN(A),
vis also simplicial inG.

```
This implies a result of Hajnal and Sur ́anyi [1958]:
```
Theorem 7.10.The complement of any chordal graph is perfect.

Proof.LetG= (V, E) be a chordal graph. Since the class of chordal graphs is closed
under taking induced subgraphs, it suffices to showω(G)≥χ(G).
By Theorem 7.1,Ghas a simplicial vertexv. SoK:={v}∪N({v}) is a clique.
LetG′be the subgraph ofGinduced byV\K. By induction we haveω(G′) =χ(G′).
Nowω(G)≥ω(G′) + 1, since we can addvto any clique ofG′. Similarly,χ(G)≤
χ(G′) + 1, since we can addKto any colouring ofG′. Henceω(G)≥χ(G).

```
With Lov ́asz’s perfect graph theorem, this implies the result of Berge [1960]:
```
Corollary 7.10a. Any chordal graph is perfect.

Proof.Directly from Theorem 7.10 and the perfect graph theorem (Corollary 7.7a).

We can characterize chordal graphs in terms of subtrees of a treeT. LetSbe a
collection of nonempty subtrees of a treeT. Theintersection graphofSis the graph
with vertex setS, where two verticesS, S′are adjacent if and only if they intersect
(in at least one vertex).
The class of graphs obtained in this way coincides with the class of chordal graphs.
To see this, we first show the following elementary lemma:


130 Chapter 7. Cliques, stable sets, and colourings

Lemma 7.1.LetSbe a collection of pairwise intersecting subtrees of a treeT. Then
there is a vertex ofT contained in all subtrees inS.

Proof.By induction on|V T|. If|V T|= 1 the lemma is trivial, so assume|V T|≥2.
Lettbe an end vertex ofT. If there exists a subtree inS consisting only oft, the
lemma is trivial. Hence we may assume that each subtree inS containingtalso
contains the neighbour oft. So deletingtfromTand from all subtrees inSgives the
lemma by induction.

```
Then:
```
Theorem 7.11. A graph is chordal if and only if it is isomorphic to the intersection
graph of a collection of subtrees of some tree.

Proof.Necessity.LetG= (V, E) be chordal. By Theorem 7.9,Gcontains a simplicial
vertexv. By induction, the subgraphG−vofGis the intersection graph of a collection
Sof subtrees of some treeT. LetS′be the subcollection ofS corresponding to the
setNof neighbours ofvinG. AsN is a clique,S′consists of pairwise intersecting
subtrees. Hence, by Lemma 7.1 these subtrees have a vertextofTin common. Now
we extendTand all subtrees inS′with a new vertext′and a new edgett′. Moreover,
we introduce a new subtree{t′}representing v. In this way we obtain a subtree
representation forG.
Sufficiency. Let G be the intersection graph of some collection S of subtrees
of some tree T. Suppose that Gcontains a chordless circuitCk withk ≥4. Let
Ck be the intersection graph ofS 1 ,... , Sk ∈ S, withS 1 andS 2 intersecting. Then
S 1 , S 2 , S 3 ∪···∪Skare three subtrees ofTthat are pairwise intersecting. So by Lemma
7.1,Thas a vertexvcontained in each of these three subtrees. Sov∈S 1 ∩S 2 ∩Si
for somei∈{ 3 ,... , k}. This yields a chord inCk.

This theorem enables us to interpret the perfectness of chordal graphs in terms of
trees:

Corollary 7.11a. LetS be a collection of nonempty subtrees of a tree T. Then
the maximum number of pairwise vertex-disjoint trees inS is equal to the minimum
number of vertices ofT intersecting each tree inS.

Proof.Directly from Theorems 7.10 and 7.11, using Lemma 7.1.

```
Similarly we have:
```
Corollary 7.11b. LetS be a collection of subtrees of a treeT. Letkbe the max-
imum number of times that any vertex ofT is covered by trees inS. ThenS can
be partitioned into subcollections S 1 ,... ,Sk such that each Si consists of pairwise


Section 7.5. Chordal graphs 131

vertex-disjoint trees.

Proof.Directly from Corollary 7.10a and Theorem 7.11, again usingLemma 7.1.

Exercises

```
7.28. Show that a graphG= (V,E) is chordal if and only if each induced subgraph has a
simplicial vertex.
```
```
7.29. Show that a graph is an interval graph if and only if it ischordal and its complement
is a comparability graph.
```
```
7.30. Derive from the proof of Theorem 7.9 that each chordal graph is either a clique or
contains two nonadjacent simplicial vertices.
```
```
7.31. LetGbe a chordal graph. Derive from the proof of Theorem 7.9 that each vertex
vthat is nonadjacent to at least one vertexw 6 =v, is nonadjacent to at least one
simplicial vertexw 6 =v.
```
```
7.32. Show that a graphG= (V,E) is chordal if and only if the edges ofGcan be oriented
so as to obtain a directed graphD= (V,A) with the following properties:
```
```
(26) (i)Dis acyclic;
(ii)if (u,v) and (u,w) belong toAthen (v,w) or (w,v) belongs toA.
```

132 Chapter 8. Integer linear programming and totally unimodular matrices

### 8. Integer linear programming and totally unimodular matrices

##### 8.1. Integer linear programming

Many combinatorial optimization problems can be describedas maximizing a linear
functioncTxover the integervectors in some polyhedron P ={x| Ax≤ b}. (A
vectorx∈Rnis calledintegerif each component is an integer, i.e., ifxbelongs to
Zn.)
So this type of problems can be described as:

(1) max{cTx|Ax≤b;x∈Zn}.

Such problems are calledinteger linear programmingproblems. They consist of max-
imizing a linear function over the intersectionP∩Znof a polyhedronPwith the set
Znof integer vectors.

Example. Consider a graphG= (V, E). Then the problem of finding a matching
of maximum cardinality can be described as follows. LetAbe theV×Eincidence
matrix ofG. So the rows ofAare indexed by the vertices ofG, while the columns of
Aare indexed by the edges ofGand for anyv∈V ande∈E:

(2) Av,e := 1 ifv∈e;
:= 0 ifv6∈e.

Now finding a maximum-cardinality matching is equivalent to:

(3) maximize

###### ∑

```
e∈E
```
```
xe
```
```
subject to
```
###### ∑

```
e∋v
```
```
xe≤1 for eachv∈V,
```
```
xe≥ 0 for eache∈E,
xe∈Z for eache∈E.
```
This is the same as:

(4) max{ 1 Tx|x≥0;Ax≤ 1 ;xinteger},

where 1 denotes an all-one vector, of appropriate size.


Section 8.1. Integer linear programming 133

```
Clearly, always the following holds:
```
(5) max{cTx|Ax≤b;xinteger}≤max{cTx|Ax≤b}.

The above example, applied to the graphK 3 shows that strict inequality can hold.
This implies, that generally one will have strict inequality in the following duality
relation:

(6) max{cTx|Ax≤b;xinteger}≤min{yTb|y≥0;yTA=cT;yinteger}.

A polytopeP is calledintegerif each of its vertices is an integer vector. Clearly,
if a polytopeP={x|Ax≤b}is integer, then theLP-problem

(7) max{cTx|Ax≤b}

has an integer optimum solution. So in that case,

(8) max{cTx|Ax≤b;xinteger}= max{cTx|Ax≤b}.

In Exercise 8.5 below we shall see that in a sense also the converse holds.

No polynomial-time algorithm is known to exist for solving aninteger linear pro-
gramming problem in general. In fact, the general integer linear programming prob-
lem is NP-complete, and it is conjectured that no polynomial-time algorithm exists.

However, for special classes of integer linear programming problems, polynomial-
time algorithms have been found. These classes often come from combinatorial prob-
lems, like the matching problem above.

Exercises

```
8.1. LetPbe a polytope. Prove that the set conv.hull(P∩Zn) is again a polytope.
```
```
8.2. LetP={x|Ax≤b}be a polyhedron, whereAis a rational matrix. Show that the
set conv.hull(P∩Zn) is again a polyhedron.
```
```
8.3. LetG= (V,E) be a graph. Describe the problem of finding a vertex cover of minimum
cardinality as an integer linear programming problem.
```
```
8.4. LetG= (V,E) be a graph. Describe the problem of finding a clique (= complete
subgraph) of maximum cardinality as an integer linear programming problem.
```
```
8.5. Show that a polytopePis integer if and only if for each vectorc, the linear program-
ming problem max{cTx|Ax≤b}has an integer optimum solution.
```

134 Chapter 8. Integer linear programming and totally unimodular matrices

##### 8.2. Totally unimodular matrices

Total unimodularity of matrices turns out to form an important tool in studying
integer vectors in polyhedra.
A matrixAis calledtotally unimodularif each square submatrix ofAhas determi-
nant equal to 0, +1, or−1. In particular, each entry of a totally unimodular matrix
is 0, +1, or−1.
A link between total unimodularity and integer linear programming is given by
the following fundamental result.

Theorem 8.1. LetAbe a totally unimodularm×nmatrix and letb∈Zm. Then
each vertex of the polyhedron

(9) P:={x|Ax≤b}

is an integer vector.

Proof. LetAhave order m×n. Let z be a vertex ofP. By Theorem 2.2, the
submatrixAzhas rankn. SoAzhas a nonsingularn×nsubmatrixA′. Letb′be the
part ofbcorresponding to the rows ofAthat occur inA′.
Since, by definition,Az is the set of rowsai ofAfor whichaiz =bi, we know
A′z=b′. Hencez= (A′)−^1 b′. However, since|detA′|= 1, all entries of the matrix
(A′)−^1 are integer. Therefore,zis an integer vector.

As a direct corollary we have a similar result for polyhedra ingeneral (not neces-
sarily having vertices). Define a polyhedronP to beintegerif for each vectorcfor
which

(10) max{cTx|x∈P}

is finite, the maximum is attained by some integer vector. So:

(11) ifP={x|Ax≤b}whereAis anm×nmatrix of rankn, thenPis integer
if and only if each vertex ofPis integer.

```
Then we have:
```
Corollary 8.1a. LetAbe a totally unimodularm×nmatrix and letb∈Zm. Then
the polyhedron

(12) P:={x|Ax≤b}

is an integer polyhedron.


Section 8.2. Totally unimodular matrices 135

Proof.Letx∗be an optimum solution of (10). Choose integer vectorsd′, d′′∈Zn
such thatd′≤x∗≤d′′. Consider the polyhedron

(13) Q:={x∈Rn|Ax≤b;d′≤x≤d′′}.

SoQis bounded.
Moreover,Qis the set of all vectorsxsatisfying

###### (14)

###### 

###### 

###### A

###### −I

###### I

###### 

```
x≤
```
###### 

###### 

```
b
−d′
d′′
```
###### 

###### .

Now the matrix here is again totally unimodular (this followseasily from the total
unimodularity ofA). Hence by Theorem 8.1,Qis an integer polytope. This implies
that the linear programming problem max{cTx|x∈Q}is attained by some integer
vector ̃x.
But then ̃xis also an optimum solution for the original LP-problem max{cTx|
Ax≤b}. Indeed, ̃xsatisfiesAx ̃≤b, as ̃xbelongs toQ. Moreover,

(15) cTx ̃≥cTx∗= max{cTx|Ax≤b},

implying that ̃xis an optimum solution.

It follows that each linear programming problem with integer data and totally
unimodular constraint matrix has integer optimum primal and dual solutions:

Corollary 8.1b. LetAbe a totally unimodular m×nmatrix, let b∈Zm and let
c∈Zn. Then both problems in the LP-duality equation:

(16) max{cTx|Ax≤b}= min{yTb|y≥0;yTA=cT}

have integer optimum solutions (if the optima are finite).

Proof.Directly from Corollary 8.1a, using the fact that withAalso the matrix

###### (17)

###### 

###### 

###### −I

###### AT

###### −AT

###### 

###### 

is totally unimodular.

```
Hoffman and Kruskal [1956] showed, as we shall see below, that the above property
```

136 Chapter 8. Integer linear programming and totally unimodular matrices

more or less characterizes total unimodularity.
To derive this result, define anm×nmatrixAto beunimodularif it has rankm
and eachm×msubmatrix has determinant equal to 0, +1, or−1. It is easy to see
that a matrixAis totally unimodular if and only if the matrix [I A] is unimodular.
We follow the proof of Hoffman and Kruskal’s result given by Veinott and Dantzig
[1968]. As a preparation one first shows:

Theorem 8.2.LetAbe an integerm×nmatrix of rankm. ThenAis unimodular
if and only if for each integer vectorbthe polyhedron

(18) P={x|x≥0;Ax=b}

is integer.

Proof.Necessity. First suppose thatAis unimodular. Letbbe an integer vector.
LetDbe the matrix

###### (19) D:=

###### 

###### 

###### −I

###### A

###### −A

###### 

```
 andf:=
```
###### 

###### 

###### 0

```
b
−b
```
###### 

###### .

Note that the systemx≥ 0 , Ax=bis the same asDx≤f.
SinceDhas rank n, we know that for eachc ∈ Rn, the linear programming
problem

(20) max{cTx|x≥0;Ax=b}= max{cTx|Dx≤f}

is attained by avertexzofP(if the optima are finite).
Now consider the matrixDz. By definition, this is the submatrix ofDconsisting
of those rowsDiofDwhich have equality inDz≤f.
Clearly,Dzcontains all rows ofDthat are inAand in−A. SinceAhas rankm,
this implies thatDzcontains a nonsingularn×nmatrixBthat fully containsAand
moreover, part of−I. SinceAis unimodular, detBequals +1 or−1. Letf′be the
part offcorresponding toB. SoBz=f′, and hencez=B−^1 f′. As|detB|= 1, it
follows thatzis an integer vector.

Sufficiency. Suppose thatP={x|x≥0;Ax=b}is integer, for each choice of
an integer vectorb. LetBbe anm×mnonsingular submatrix ofA. We must show
that detBequals +1 or−1.
Without loss of generality, we may assume thatBconsists of the firstmcolumns
ofA.

It suffices to show thatB−^1 vis an integer vector for each choice of an integer
vectorv. (This follows from the fact that thenB−^1 itself is an integer matrix, and


Section 8.2. Totally unimodular matrices 137

hence (detB)−^1 =det(B−^1 ) is an integer. This implies that detBequals +1 or−1.)
So letvbe an integer vector. Then there exists an integer vectoru∈Rm such
that

(21) z:=u+B−^1 v > 0.

Define

(22) b:=Bz.

Sob=Bz=Bu+BB−^1 v=Bu+vis an integer vector.
Letz′arise fromzby adding zero-components tozso as to obtain a vector inRn.
So

(23) z′=

###### (

```
z
0
```
###### )

###### ,

where 0 is the all-zero vector inRn−m.
Thenz′is a vertex of the polyhedronP(sincez′∈Pand since there arenlinearly
independent rows in the matrixDfor whichDz≤fholds with equality).
Soz′is integer, and hence

(24) B−^1 v=z−u

is an integer vector.

```
This gives the result of Hoffman and Kruskal [1956]:
```
Corollary 8.2a (Hoffman-Kruskal theorem). Let Abe an integerm×nmatrix.
ThenAis totally unimodular if and only if for each integer vectorbthe polyhedron

(25) P={x|x≥0;Ax≤b}

is integer.

Proof.Necessity.Directly from Corollary 8.1a.

Sufficiency.LetPbe an integer polyhedron, for each choice of an integer vector
b. We show that, for each choice ofb∈Zm, each vertexzof the polyhedron

(26) Q:={z|z≥0; [I A]z=b}.

is integer. Indeed,zcan be decomposed as


138 Chapter 8. Integer linear programming and totally unimodular matrices

(27) z=

###### (

```
z′
z′′
```
###### )

###### ,

wherez′∈Rmandz′′∈Rn. Soz′=b−Az′′.

```
Thenz′′is a vertex ofP. [This follows from the fact that ifz′′would be equal to
1
2 (v+w) for two other pointsv, winP, then
```
(28) z′=b−Az′′=

###### 1

###### 2

```
(b−Av) +
```
###### 1

###### 2

```
(b−Aw).
```
Hence

(29) z=

###### (

```
z′
z′′
```
###### )

###### =

###### 1

###### 2

###### (

```
b−Av
v
```
###### )

###### +

###### 1

###### 2

###### (

```
b−Aw
w
```
###### )

###### .

This contradicts the fact thatzis a vertex ofQ.]

So, by assumption,z′′is integer. Hence alsoz′=b−Az′′is integer, and hencez
is integer.
So for each choice ofbinZm, the polyhedronQis integer. Hence, by Theorem
8.2, the matrix [I A] is unimodular. This implies thatAis totally unimodular.

Exercises

```
8.6. Show that an integer matrixAis totally unimodular if and only if for all integer
vectorsbandc, both sides of the linear programming duality equation
```
```
(30) max{cTx|x≥0;Ax≤b}= min{yTb|y≥0;yTA≥cT}
```
```
are attained by integer optimum solutionsxandy(if the optima are finite).
```
```
8.7. Give an example of an integer matrixAand an integer vectorbsuch that the poly-
hedronP:={x|Ax≤b}is integer, whileAis not totally unimodular.
```
```
8.8. LetAbe a totally unimodular matrix. Show that the columns ofAcan be split
into two classes such that the sum of the columns in one class,minus the sum of the
columns in the other class, gives a vector with entries 0, +1,and−1 only.
```
```
8.9. LetAbe a totally unimodular matrix and letbbe an integer vector. Letxbe an
integer vector satisfyingx≥0;Ax≤ 2 b. Show that there exist integer vectorsx′≥ 0
andx′′≥0 such thatAx′≤b,Ax′′≤bandx=x′+x′′.
```

Section 8.3. Totally unimodular matrices from bipartite graphs 139

##### 8.3. Totally unimodular matrices from bipartite graphs

LetAbe theV×Eincidence matrix of a graphG= (V, E) (cf. (2)). The matrix
Agenerally is not totally unimodular. E.g., ifGis the complete graphK 3 on three
vertices, then the determinant ofAis equal to +2 or−2.
However, the following can be proved:

Theorem 8.3. GraphGis bipartite if and only if its incidence matrixAis totally
unimodular.

Proof.Sufficiency.LetAbe totally unimodular. SupposeGis not bipartite. Then
Gcontains an odd circuit, say with verticesv 1 ,... , vkand edgese 1 ,... , ek. The sub-
matrix ofAon the rows indexed byv 1 ,... , vkand the columns indexed bye 1 ,... , ek,
is of type

###### (31)

######           

###### 1 1 0 ··· ··· 0 0

###### 0 1 1 ··· ··· 0 0

###### 0 0 1 ··· ··· 0 0

###### ..

###### .

###### ..

###### .

###### ..

###### .

###### ... ..

###### .

###### ..

###### .

###### ..

###### .

###### ..

###### .

###### ..

###### .

###### ... ..

###### .

###### ..

###### .

###### 0 0 0 ··· ··· 1 1

###### 1 0 0 ··· ··· 0 1

######           

###### ,

up to permutation of rows and columns.

It is not difficult to see that matrix (31) has determinant 2. This contradicts the
total unimodularity ofA.

Necessity. LetGbe bipartite. LetBbe a square submatrix ofA, of ordert×t,
say. We show that detBequal 0 or±1 by induction ont. Ift= 1, the statement is
trivial.
So lett >1. We distinguish three cases.
Case 1.Bhas a column with only 0 ’s.Then detB=0.

Case 2.Bhas a column with exactly one 1 .In that case we can write (possibly
after permuting rows or columns):

###### (32) B=

###### (

```
1 bT
0 B′
```
###### )

###### ,

for some matrixB′and vectorb, where 0 denotes the all-zero vector inRt−^1. By the
induction hypothesis, detB′∈{ 0 ,± 1 }. Hence, by (32), detB∈{ 0 ,± 1 }.


140 Chapter 8. Integer linear programming and totally unimodular matrices

Case 3.Each column ofBcontains exactly two 1 ’s. Then, sinceGis bipartite,
we can write (possibly after permuting rows):

###### (33) B=

###### (

###### B′

###### B′′

###### )

###### ,

in such a way that each column ofB′ contains exactly one 1 and each column of
B′′contains exactly one 1. So adding up all rows inB′gives the all-one vector, and
also adding up all rows inB′′gives the all-one vector. Therefore, the rows ofBare
linearly dependent, and hence detB=0.

As direct corollaries of this theorem, together with Corollary 8.1b, we obtain some
theorems of K ̋onig. First:

Corollary 8.3a(K ̋onig’s matching theorem). LetGbe a bipartite graph. Then the
maximum cardinality of a matching inGis equal to the minimum cardinality of a
vertex cover inG.

Proof. Clearly, the maximum cannot be larger than the minimum. To see that
equality holds, letAbe theV×Eincidence matrix ofG. Then by Corollary 8.1b,
both optima in the LP-duality equation

(34) max{ 1 Tx|x≥0;Ax≤ 1 }= min{yT 1 |y≥0;yTA≥ 1 }

are attained by integer optimum solutionsx∗andy∗.
Sincex∗is an integer vector satisfyingx≥0;Ax≤ 1 ,x∗is a{ 0 , 1 }vector. Let
Mbe the set of edgeseofGfor whichx∗e= 1. ThenMis a matching, sinceAx∗≤ 1
holds, implying that for each vertexv there is at most one edgee withx∗e = 1.
Moreover, the cardinality|M|of M satisfies|M|= 1 Tx∗. So|M|is equal to the
maximum in (34).
On the other hand, as vectory∗attains the minimum in (34), it should be a{ 0 , 1 }
vector. (If some component would be 2 or larger, we could reduce it to 1, without
violatingyTA≥ 1 but decreasingyT 1. This contradicts the fact thaty∗attains the
minimum.)

LetW be the set of vertices ofGfor whichy∗v= 1. ThenW is a vertex cover,
sincey∗TA≥ 1 holds, implying that for each edgeeofGthere is at least one vertex
vwithyv∗= 1. Moreover, the cardinality|W|ofW satisfies|W|=y∗T 1. So|W|is
equal to the minimum in (34).

```
One similarly derives:
```
Corollary 8.3b(K ̋onig’s edge cover theorem).LetGbe a bipartite graph. Then the


Section 8.3. Totally unimodular matrices from bipartite graphs 141

maximum cardinality of a stable set inGis equal to the minimum cardinality of an
edge cover inG.

Proof.Similar to the proof of Corollary 8.1a (now withAT instead ofA).

One can also derive weighted versions of these two min-max relations. LetXbe
some finite set and letw:X→Rbe a ‘weight’ function onX. Theweightw(Y) of
some subsetY⊆Xis, by definition:

(35) w(Y) :=

###### ∑

```
x∈Y
```
```
w(x).
```
Then:

Corollary 8.3c. LetG= (V, E)be a bipartite graph and letw:E→Z+be a weight
function onE. Then:

```
(i) The maximum weight of a matching in∑ Gis equal to the minimum value of
v∈Vf(v), wheref ranges over all functionsf :V →Z+such thatf(u) +
f(v)≥w({u, v})for each edge{u, v}ofG;
```
```
(ii) The minimum weight of an edge cover in∑ Gis equal to the maximum value of
v∈Vf(v), wheref ranges over all functionsf :V →Z+such thatf(u) +
f(v)≤w({u, v})for each edge{u, v}ofG.
```
Proof.The statements are equivalent to both sides in

(36) max{wTx|x≥0;Ax≤ 1 }= min{yT 1 |y≥0;yTA≥w}

and in

(37) min{wTx|x≥0;Ax≥ 1 }= max{yT 1 |y≥0;yTA≤w}

having integer optimum solutions. These facts follow from Theorem 8.3 and Corollary
8.1b.

Similarly one has min-max relations for the maximum weight of a stable set and
the minimum weight of a vertex cover in bipartite graphs (cf.Exercises 8.10 and 8.11).
Another corollary is as follows. For any finite setXand any subsetYofX, define
theincidence vectorχY ∈RXofY as:

(38) χYx := 1 ifx∈Y;
:= 0 ifx6∈Y.


142 Chapter 8. Integer linear programming and totally unimodular matrices

Now letG= (V, E) be a graph. Thematching polytopePmatching(G) ofGis, by
definition, the convex hull (inRE) of the incidence vectors of all matchings in G.
That is:

(39) Pmatching(G) = conv.hull{χM|Mmatching inG}.

Now with Theorem 8.3 we can give the linear inequalities describingPmatching(G):

Corollary 8.3d. IfGis bipartite, the matching polytopePmatching(G)ofGis equal
to the set of vectorsxinREsatisfying:

(40) (i) xe ≥ 0 for eache∈E;

```
(ii)
```
###### ∑

```
e∋v
```
```
xe ≤ 1 for eachv∈V.
```
Proof.LetQbe the polytope defined by (40). Clearly,Pmatching(G)⊆Q, since the
incidence vectorχM of any matchingM satisfies (40).
To see thatQ⊆Pmatching(G), observe thatQsatisfies

(41) Q={x|x≥0;Ax≤ 1 },

whereAis the incidence matrix ofA.
SinceAis totally unimodular (Theorem 8.3), we know thatQis integer, i.e., that
each vertex ofQis an integer vector (Corollary 8.1a). SoQis the convex hull of the
integer vectors contained inQ. Now each integer vector inQis equal to the incidence
vectorχM of some matchingMinG. SoQmust be contained inPmatching(G).

Again, one cannot delete the bipartiteness condition here, as for any odd circuit
there exists a vector satisfying (40) but not belonging to the matching polytope
Pmatching(G).
Similarly, let theperfect matching polytopePperfect matching(G) ofGbe defined as
the convex hull of the incidence vectors of theperfectmatchings inG. Then we have:

Corollary 8.3e. IfGis bipartite, the perfect matching polytopePperfect matching(G)of
Gis equal to the set of vectorsxinREsatisfying:

(42) (i) xe ≥ 0 for eache∈E;

```
(ii)
```
###### ∑

```
e∋v
```
```
xe = 1 for eachv∈V.
```
Proof.Similarly as above.


Section 8.4. Totally unimodular matrices from directed graphs 143

Exercises

```
8.10. Give a min-max relation for the maximum weight of a stable set in a bipartite graph.
```
```
8.11. Give a min-max relation for the minimum weight of a vertex cover in a bipartite
graph.
```
```
8.12. LetG= (V,E) be a nonbipartite graph. Show that the inequalities (40) are not
enough to define the matching polytope ofG.
```
```
8.13. Theedge cover polytopePedge cover(G) of a graph is the convex hull of the incidence
vectors of the edge covers inG. Give a description of the linear inequalities defining
the edge cover polytope of a bipartite graph.
```
```
8.14. Thestable set polytopePstable set(G) of a graph is the convex hull of the incidence
vectors of the stable sets inG. Give a description of the linear inequalities defining
the stable set polytope of a bipartite graph.
```
```
8.15. Thevertex cover polytopePvertex cover(G) of a graph is the convex hull of the incidence
vectors of the vertex covers inG. Give a description of the linear inequalities defining
the vertex cover polytope of a bipartite graph.
```
```
8.16. Derive from Corollary 8.3e that for each doubly stochastic matrixM there exist
permutation matricesP 1 ,...,Pmand realsλ 1 ,...,λm≥0 such thatλ 1 +···+λm= 1
and
```
```
(43) M=λ 1 P 1 +···λmPm.
```
```
(A matrixMis calleddoubly stochasticif each row sum and each column sum is equal
to 1. A matrixPis called apermutation matrixif it is a{ 0 , 1 }matrix, with in each
row and in each column exactly one 1.)
```
##### 8.4. Totally unimodular matrices from directed graphs

A second class of totally unimodular matrices can be derivedfrom directed graphs.
LetD= (V, A) be a directed graph. TheV×Aincidence matrixM ofDis defined
by:

(44) Mv,a := +1 ifaleavesv,
:= −1 ifaentersv,
:= 0 otherwise.

So each column ofM has exactly one +1 and exactly one−1, while all other entries
are 0.
Now we have:


144 Chapter 8. Integer linear programming and totally unimodular matrices

Theorem 8.4.The incidence matrixM of any directed graphDis totally unimodu-
lar.

Proof.LetBbe a square submatrix ofM, of ordertsay. We prove that detB∈
{ 0 ,± 1 }by induction ont, the caset= 1 being trivial.
Lett >1. We distinguish three cases.
Case 1.Bhas a column with only zeros.Then detB= 0.
Case 2. Bhas a column with exactly one nonzero. Then we can write (up to
permuting rows and columns):

###### (45) B=

###### (

```
± 1 bT
0 B′
```
###### )

###### ,

for some vectorband matrixB′.
Now by our induction hypothesis, detB′∈{ 0 ,± 1 }, and hence detB∈{ 0 ,± 1 }.
Case 3. Each column of B contains two nonzeros. Then each column of B
contains one +1 and one−1, while all other entries are 0. So the rows ofBadd up
to an all-zero vector, and hence detB= 0.

The incidence matrixM of a directed graph D = (V, A) relates to flows and
circulations inD. Indeed, any vectorx∈RAcan be considered as a function defined
on the arcs ofD. Then the condition

(46) M x= 0

is just the ‘flow conservation law’. That is, it says:

###### (47)

###### ∑

```
a∈δout(v)
```
```
x(a) =
```
###### ∑

```
a∈δin(v)
```
```
x(a) for eachv∈V.
```
So we can derive from Theorem 8.4:

Corollary 8.4a.LetD= (V, A)be a directed graph and letc:A→Zandd:A→Z.
If there exists a circulationxonA with c≤ x ≤ d, then there exists an integer
circulationxonAwithc≤x≤d.

Proof.If there exists a circulationxwithc≤x≤d, then the polytope

(48) P:={x|c≤x≤d;M x= 0}

is nonempty. So it has at least one vertexx∗. Then, by Corollary 8.1a,x∗ is an
integer circulation satisfyingc≤x∗≤d.


Section 8.4. Totally unimodular matrices from directed graphs 145

In fact, one can derive Hoffman’s circulation theorem— see Exercise 8.17. Another
theorem that can be derived is the max-flow min-cut theorem.

Corollary 8.4b (max-flow min-cut theorem). LetD= (V, A)be a directed graph,
letsandtbe two of the vertices ofD, and letc:A→R+be a ‘capacity’ function
onA. Then the maximum value of ans−tflow subject tocis equal to the minimum
capacity of ans−tcut.

Proof.Since the maximum clearly cannot exceed the minimum, it suffices to show
that there exists ans−tflowx≤cand ans−tcut, the capacity of which is not
more than the value ofx.
LetMbe the incidence matrix ofDand letM′arise fromMby deleting the rows
corresponding tosandt. So the conditionM′x= 0 means that the flow conservation
law should hold in any vertexv 6 =s, t.
Letwbe the row ofM corresponding to vertexs. Sowa= +1 if arcaleavess
andwa=−1 if arcaenterss, whilewa= 0 for all other arcsa.
Now the maximum value of ans−tflow subject tocis equal to

(49) max{wTx| 0 ≤x≤c;M′x= 0}.

By LP-duality, this is equal to

(50) min{yTc|y≥0;yT+zTM′≥w}.

The inequality system in (50) is:

(51) (yT zT)

###### (

###### I I

###### 0 M′

###### )

```
≥(0 w).
```
The matrix here is totally unimodular, by Theorem 8.4.
Sincew is an integer vector, this implies that the minimum (50) is attained by
integervectorsyandz.
Now define

(52) W:={v∈V\{s, t}|zv≤− 1 }∪{s}.

SoWis a subset ofV containingsand not containingt.
It suffices now to show that

(53) c(δout(W))≤yTc,

sinceyTcis not more than the maximum flow value (49).


146 Chapter 8. Integer linear programming and totally unimodular matrices

```
To prove (53) it suffices to show that
```
(54) ifa= (u, v)∈δout(W) thenya≥1.

Define ̃zr:=−1, ̃zs:= 0, and ̃zu=zufor all otheru. ThenyT+ ̃zTM≥0. Hence
for alla= (u, v)∈δout(W) one hasya+ ̃zu− ̃zv≥0, implyingya≥z ̃v−z ̃u≥1. This
proves (54).

Similarly as in Corollary 8.4a it follows that if all capacities are integers, then
there exists a maximumintegerflow.
Next define a matrix to be aninterval matrixif each entry is 0 or 1 and each row
is of type

###### (55) (0,... , 0 , 1 ,... , 1 , 0 ,... ,0).

Corollary 8.4c.Each interval matrix is totally unimodular.

Proof.LetM be an interval matrix and letBbe at×tsubmatrix ofM. ThenB
is again an interval matrix. LetN be thet×tmatrix given by:

###### (56) N:=

######           

###### 1 −1 0 ··· ··· 0 0

###### 0 1 − 1 ··· ··· 0 0

###### 0 0 1 ··· ··· 0 0

###### ..

###### .

###### ..

###### .

###### ..

###### .

###### ... ..

###### .

###### ..

###### .

###### ..

###### .

###### ..

###### .

###### ..

###### .

###### ... ..

###### .

###### ..

###### .

###### 0 0 0 ··· ··· 1 − 1

###### 0 0 0 ··· ··· 0 1

######           

###### .

Then the matrixN·BT is a{ 0 ,± 1 }matrix, with at most one +1 and at most one
−1 in each column.
So it is a submatrix of the incidence matrix of some directed graph. Hence by
Theorem 8.4, det(N·BT)∈ { 0 ,± 1 }. Moreover, detN = 1. So detB= detBT ∈
{ 0 ,± 1 }.

Exercises

```
8.17. Derive Hoffman’s circulation theorem (Theorem 4.6) from Theorem 8.4.
```
```
8.18. Derive Dilworth’s decomposition theorem (Theorem 7.6) from Theorem 8.4.
```
```
8.19. LetD= (V,A) be a directed graph and letT= (V,A′) be a directed spanning tree
onV.
```

Section 8.4. Totally unimodular matrices from directed graphs 147

```
LetCbe theA′×Amatrix defined as follows. Takea′∈A′anda= (u,v)∈A,
and defineCa′,a:= +1 ifa′occurs in forward direction in theu−vpath inT and
Ca′,a:=−1 ifa′occurs in backward direction in theu−vpath inT. For all other
a′∈A′anda∈AsetCa′,a:= 0.
```
```
(i) Prove thatCis totally unimodular.
(Hint:Use a matrix similar to matrixNin Corollary 8.4c.)
(ii) Show that interval matrices and incidence matrices of directed graphs are special
cases of such a matrixC.
```

```
148 Chapter 9. Multicommodity flows and disjoint paths
```
### 9. Multicommodity flows and disjoint paths

##### 9.1. Introduction

```
The problem of finding a maximum flow from one ‘source’sto one ‘sink’tis highly
tractable. There is a very efficient algorithm, which outputsan integer maximum
flow if all capacities are integer. Moreover, the maximum flowvalue is equal to
the minimum capacity of a cut separatingsandt. If all capacities are equal to 1,
the problem reduces to finding arc-disjoint paths. Some direct transformations give
similar results for vertex capacities and for vertex-disjoint paths.
Often in practice however, one is not interested in connecting only one pair of
source and sink by a flow or by paths, but several pairs of sources and sinks simulta-
neously. One may think of a large communication or transportation network, where
several messages or goods must be transmitted all at the sametime over the same
network, between different pairs of terminals. A recent application is the design of
very large-scale integrated(VLSI) circuits, where several pairs of pins must be inter-
connected by wires on a chip, in such a way that the wires follow given ‘channels’ and
that the wires connecting different pairs of pins do not intersect each other.
Mathematically, these problems can be formulated as follows. First, there is the
multicommodity flow problem(ork-commodity flow problem):
```
(1) given: a directed graphG= (V, E),pairs (s 1 , t 1 ),... ,(sk, tk) of vertices ofG, a
‘capacity’ functionc:E→Q+, and ‘demands’d 1 ,... , dk,
find: for eachi= 1,... , k,ansi−tiflowxi∈QE+so thatxihas valuediand so
that for each arceofG:

```
∑k
```
```
i=1
```
```
xi(e)≤c(e).
```
```
The pairs (si, ti) are called thecommoditiesor thenets. (We assumesi 6 =tithrough-
out.)
If we require eachxi to be an integer flow, the problem is called theinteger
multicommodity flow problemorintegerk-commodity flow problem. (To distinguish
from the integer version of this problem, one sometimes addsthe adjectivefractional
to the name of the problem if no integrality is required.)
The problem has a natural analogue to the case whereGis undirected. We replace
each undirected edgee={v, w}by two opposite arcs (v, w) and (w, v) and ask for
flowsx 1 ,... , xk of valuesd 1 ,... , dk, respectively, so that for each edgee={v, w}of
G:
```

```
Section 9.1. Introduction 149
```
###### (2)

```
∑k
```
```
i=1
```
```
(xi(v, w) +xi(w, v))≤c(e).
```
```
Thus we obtain theundirected multicommodity flow problemorundirectedk-commodity
flow problem. Again, we addintegerif we require thexito be integer flows.
If all capacities and demands are 1, the integer multicommodity flow problem is
equivalent to thearc-oredge-disjoint paths problem:
```
(3) given: a (directed or undirected) graphG= (V, E), pairs (s 1 , t 1 ),... ,(sk, tk) of
vertices ofG,
find: pairwise edge-disjoint pathsP 1 ,... , Pk wherePi is ansi−ti path (i=
1 ,... , k).

```
Related is thevertex-disjoint paths problem:
```
(4) given: a (directed or undirected) graphG= (V, E), pairs (s 1 , t 1 ),... ,(sk, tk) of
vertices ofG,
find: pairwise vertex-disjoint pathsP 1 ,... , Pk wherePiis ansi−tipath (i=
1 ,... , k).

```
We leave it as an exercise (Exercise 9.1) to check that the vertex-disjoint paths
problem can be transformed to the directed edge-disjoint paths problem.
The (fractional) multicommodity flow problem can be easily described as one of
solving a system of linear inequalities in the variables xi(e) for i = 1,... , k and
e ∈E. The constraints are the flow conservation laws for each flowxiseparately,
together with the inequalities given in (1). Therefore, thefractional multicommod-
ity flow problem can be solved in polynomial time with any polynomial-time linear
programming algorithm.
In fact, the only polynomial-time algorithm known for the fractional multicom-
modity flow problem is any general linear programming algorithm. Ford and Fulker-
son [1958] designed an algorithm based on the simplex method, with column genera-
tion — see Section 9.6.
The followingcut conditiontrivially is a necessary condition for the existence of
a solution to the fractional multicommodity flow problem (1):
```
```
(5) for each W ⊆V the capacity ofδEout(W) is not less than the demand of
δoutR (W),
```
```
whereR:={(s 1 , t 1 ),... ,(sk, tk)}. However, this condition is in general not sufficient,
even not in the two simple cases given in Figure 9.1 (taking all capacities and demands
equal to 1).
One may derive from the max-flow min-cut theorem that the cut condition is
```

150 Chapter 9. Multicommodity flows and disjoint paths

```
s =t
```
```
2
```
```
2 1
```
```
t
```
```
s 1
```
```
s 1 =t 2 s 2 =t 1
```
```
Figure 9.1
```
sufficient ifs 1 =s 2 =···=sk(similarly ift 1 =t 2 =···=tk) — see Exercise 9.3.
Similarly, in the undirected case a necessary condition is the following cut condi-
tion:

(6) for eachW ⊆ V,the capacity ofδE(W) is not less than the demand of
δR(W)

(takingR:={{s 1 , t 1 },... ,{sk, tk}}). In the special case of the edge-disjoint paths
problem (where all capacities and demands are equal to 1), the cut condition reads:

(7) for eachW⊆V,|δE(W)|≥|δR(W)|.

Figure 9.2 shows that this condition again is not sufficient.

```
=s
```
t (^1) t
1
=s 2
s 4 4
t 3
t 2 =s 3
Figure 9.2
However, Hu [1963] showed that the cut condition is sufficient for the existence
of a fractional multicommodity flow, in the undirected case withk= 2 commodities.
He gave an algorithm that yields a half-integer solution if all capacities and demands
are integer. This result was extended by Rothschild and Whinston [1966]. We discuss
these results in Section 9.2.
Similar results were obtained by Okamura and Seymour [1981]for arbitraryk,
provided that the graph is planar and all terminalssi, tiare on the boundary of the
unbounded face — see Section 9.5.


Section 9.1. Introduction 151

The integer multicommodity flow problem is NP-complete, evenin the undirected
case withk= 2 commodities and all capacities equal to 1, with arbitrarydemands
d 1 , d 2 (Even, Itai, and Shamir [1976]). This implies that the undirected edge-disjoint
paths problem is NP-complete, even if|{{s 1 , t 1 },... ,{sk, tk}}|= 2.
In fact, the disjoint paths problem is NP-complete in all modes (directed/undirected,
vertex/edge disjoint), even if we restrict the graphGto be planar (D.E. Knuth (see
Karp [1975]), Lynch [1975], Kramer and van Leeuwen [1984]). For general directed
graphs the arc-disjoint paths problem is NP-complete even fork= 2 ‘opposite’ com-
modities (s, t) and (t, s) (Fortune, Hopcroft, and Wyllie [1980]).
On the other hand, it is a deep result of Robertson and Seymour [1995] that
the undirected vertex-disjoint paths problem is polynomially solvable for any fixed
numberkof commodities. Hence also the undirected edge-disjoint paths problem is
polynomially solvable for any fixed numberkof commodities.
Robertson and Seymour observed that if the graphG is planar and all termi-
nalssi, tiare on the boundary of the unbounded face, there is an easy ‘greedy-type’
algorithm for the vertex-disjoint paths problem — see Section 9.4.
It is shown by Schrijver [1994] that for each fixedk, thekdisjoint paths problem
is solvable in polynomial time for directed planar graphs. For the directed planar arc-
disjoint version, the complexity is unknown. That is, thereis the following research
problem:

Research problem. Is the directed arc-disjoint paths problem polynomially solvable
for planar graphs withk= 2 commodities? Is it NP-complete?

Application 9.1: Multicommodity flows. Certain goods or messages must be trans-
ported through the same network, where the goods or messagesmay have different sources
and sinks.
This is a direct special case of the problems described above.

Application 9.2: VLSI-routing.On a chip certain modules are placed, each containing
a number of ’pins’. Certain pairs of pins should be connectedby an electrical connection
(a ‘wire’) on the chip, in such a way that each wire follows a certain (very fine) grid on the
chip and that wires connecting different pairs of pins are disjoint.
Determining the routes of the wires clearly is a special caseof the disjoint paths prob-
lem.

Application 9.3: Routing of railway stock. An extension of Application 4.5 is as
follows. The stock of the railway company NS for the Amsterdam–Vlissingen line now
consists of two types (1 and 2 say) of units, with a different number of seatss 1 ands 2 and
different lengthl 1 andl 2. All units (also of different types) can be coupled with each other.
Again there is a schedule given, together with for each segment a minimum number of
seats and a maximum length of the train. Moreover, the pricepiof buying any unit of type
iis given.
Now the company wishes to determine the minimum costs of buying units of the two


152 Chapter 9. Multicommodity flows and disjoint paths

types so that the schedule can be performed and so that the total cost is minimized.
This can be considered as a ‘min-cost integer multicommodity circulation problem’.
That is we make the directed graphDas in Application 4.5. For each arcacorresponding
to a segment we defined(a) to be the minimum number of seats that should be offered on
that segment, andc(a) to be the maximum length possible at that segment. For all other
arcsawe defined(a) := 0 andc(a) :=∞.
One should find two integer-valued circulationsf 1 andf 2 inDsuch that

(8) s 1 f 1 (a) +s 2 f 2 (a)≥d(a) andl 1 f 1 (a) +l 2 f 2 (a)≤c(a)

for each arcaand such that the sum

∑
(p 1 f 1 (a) +p 2 f 2 (a)) is minimized, wherearanges
over all ‘overnight’ arcs. Thenfi(a) denotes the number of units of typeithat should go
on segmenta.
Again several variations are possible, incorporating for instance the kilometer costs and
maximum capacities of stock areas.

Exercises

```
9.1. Show that each of the following problems (a), (b), (c) can be reduced to problems
(b), (c), (d), respectively:
```
```
(a) the undirected edge-disjoint paths problem,
(b) the undirected vertex-disjoint paths problem,
(c) the directed vertex-disjoint paths problem,
(d) the directed arc-disjoint paths problem.
```
```
9.2. Show that the undirected edge-disjoint paths problem for planar graphs can be re-
duced to the directed arc-disjoint paths problem for planargraphs.
```
```
9.3. Derive from the max-flow min-cut theorem that the cut condition (5) is sufficient for
the existence of a fractional multicommodity flow ifs 1 =···=sk.
```
```
9.4. Show that if the undirected graphG= (V,E) is connected and the cut condition (7)
is violated, then it is violated by someW⊆V for which bothW andV \Winduce
connected subgraphs ofG.
```
```
9.5. (i) Show with Farkas’ lemma: the fractional multicommodity flow problem (1) has
a solution if and only if for each ‘length’ functionl:E→Q+one has:
```
```
(9)
```
```
∑k
```
```
i=1
```
```
di·distl(si,ti)≤
```
```
∑
```
```
e∈E
```
```
l(e)c(e).
```
```
(Here distl(s,t) denotes the length of a shortests−tpath with respect tol.)
(ii) Interprete the cut condition (5) as a special case of this condition.
```

Section 9.2. Two commodities 153

##### 9.2. Two commodities

Hu [1963] gave a direct combinatorial method for the undirected two-commodity flow
problem and he showed that in this case the cut condition suffices. In fact, he showed
that if the cut condition holds and all capacities and demands are integer, there exists
a half-integer solution. We first give a proof of this result due to Sakarovitch [1973].

Consider a graphG= (V, E), with commodities{s 1 , t 1 }and{s 2 , t 2 }, a capacity
functionc:E→Z+and demandsd 1 andd 2.

Theorem 9.1(Hu’s two-commodity flow theorem). The undirected two-commodity
flow problem, with integer capacities and demands, has a half-integer solution if and
only if the cut condition(6)is satisfied.

Proof. Suppose that the cut condition holds. Orient the edges of G arbitrarily,
yielding the directed graph D = (V, A). For any a ∈ A we denote byc(a) the
capacity of the underlying undirected edge.

```
Define for anyx∈RAand anyv∈V:
```
(10) f(x, v) :=

###### ∑

```
a∈δout(v)
```
```
x(a)−
```
###### ∑

```
a∈δin(v)
```
```
x(a).
```
Sof(x, v) is the ‘net loss’ ofxin vertexv.

```
By the max-flow min-cut theorem there exists a functionx′:A→Zsatisfying:
```
(11) f(x′, s 1 ) =d 1 , f(x′, t 1 ) =−d 1 , f(x′, s 2 ) =d 2 , f(x′, t 2 ) =−d 2 ,
f(x′, v) = 0 for each other vertexv,
|x′(a)|≤c(a) for each arcaofD.

This can be seen by extending the undirected graphGby adding two new verticess′
andt′and four new edges{s′, s 1 },{t 1 , t′}(both with capacityd 1 ) and{s′, s 2 },{t 2 , t′}
(both with capacityd 2 ) as in Figure 9.3.

```
1
```
```
t’
```
```
s
```
```
1
```
```
G
```
```
t 2
```
```
s’
```
```
s 2 t
```
```
Figure 9.3
```

154 Chapter 9. Multicommodity flows and disjoint paths

Then the cut condition for the two-commodity flow problem implies that the
minimum capacity of anys′−t′cut in the extended graph is equal tod 1 +d 2. Hence,
by the max-flow min-cut theorem, there exists an integer-valueds′−t′flow in the
extended graph of valued 1 +d 2. This givesx′satisfying (11).
Similarly, the max-flow min-cut theorem implies the existence of a functionx′′:
A→Zsatisfying:

(12) f(x′′, s 1 ) =d 1 , f(x′′, t 1 ) =−d 1 , f(x′′, s 2 ) =−d 2 , f(x′′, t 2 ) =d 2 ,
f(x′′, v) = 0 for each other vertexv,
|x′′(a)|≤c(a) for each arcaofD.

To see this we extendGwith verticess′′andt′′and edges{s′′, s 1 },{t 1 , t′′}(both with
capacityd 1 ) and{s′′, t 2 },{s 2 , t′′}(both with capacityd 2 ) (cf. Figure 9.4).

```
G
```
```
s 1 t 2
```
```
s"
```
```
s 2 t 1
```
```
t"
```
```
Figure 9.4
```
After this we proceed as above.
Now consider the vectors

(13) x 1 :=^12 (x′+x′′) andx 2 :=^12 (x′−x′′).

Sincef(x 1 , v) =^12 (f(x′, v) +f(x′′, v)) for eachv, we see from (11) and (12) thatx 1
satisfies:

(14) f(x 1 , s 1 ) =d 1 , f(x 1 , t 1 ) =−d 1 , f(x 1 , v) = 0 for all otherv.

Sox 1 gives a half-integers 1 −t 1 flow inGof valued 1. Similarly,x 2 satisfies:


Section 9.2. Two commodities 155

(15) f(x 2 , s 2 ) =d 2 , f(x 2 , t 2 ) =−d 2 , f(x 2 , v) = 0 for all otherv.

Sox 2 gives a half-integers 2 −t 2 flow inGof valued 2.

Moreover,x 1 andx 2 together satisfy the capacity constraint, since for each edge
aofD:

(16) |x 1 (a)|+|x 2 (a)|=^12 |x′(a) +x′′(a)|+^12 |x′(a)−x′′(a)|
= max{|x′(a)|,|x′′(a)|}≤c(a).

(Note that^12 |α+β|+^12 |α−β|= max{|α|,|β|}for all realsα, β.)

```
So we have a half-integer solution to the two-commodity flow problem.
```
This proof also directly gives a polynomial-time algorithmfor finding a half-integer
flow.
The cut condition is not enough to derive an integersolution, as is shown by
Figure 9.5 (taking all capacities and demands equal to 1).

```
t
```
```
1 2
```
```
s 2 1
```
```
s t
```
```
Figure 9.5
```
Moreover, as mentioned, the undirected integer two-commodity flow problem is NP-
complete (Even, Itai, and Shamir [1976]).

However, Rothschild and Whinston [1966] showed that an integer solution exists
if the cut condition holds, provided that the followingEuler conditionis satisfied:

###### (17)

###### ∑

```
e∈δ(v)c(e) ≡0 (mod 2) ifv^6 =s^1 , t^1 , s^2 , t^2 ,
≡d 1 (mod 2) ifv=s 1 , t 1 ,
≡d 2 (mod 2) ifv=s 2 , t 2.
```
(Equivalently, the graph obtained fromGby replacing each edge ebyc(e) parallel
edges and by addingdiparallel edges connectingsiandti(i= 1,2), should be an
Eulerian graph.)

Theorem 9.2. If all capacities and demands are integer and the cut condition and
the Euler condition are satisfied, then the undirected two-commodity flow problem has
an integer solution.


156 Chapter 9. Multicommodity flows and disjoint paths

Proof.If the Euler condition holds, we can takex′in the proof of Theorem 9.1 so
that the following further condition is satisfied:

(18) x′(a)≡c(a) (mod 2) for eacha∈A.

```
To see this, letx′satisfy (11) and let
```
(19) A′:={a∈A|x′(a)6≡c(a) (mod 2)}.

Then each vertexvis incident with an even numberδof arcs inA′, since

(20) δ≡f(x′, v)−f(c, v)≡ 0 (mod 2),

by (11) and (17). So ifA′ 6 =∅thenA′contains an (undirected) circuit. Increasing
and decreasingx′by 1 on the arcs along this circuit (depending on whether the arc
is forward or backward), we obtain a function again satisfying (11). Repeating this,
we finally obtain a functionx′satisfying (18).
Similarly, we can takex′′so that

(21) x′′(a)≡c(a) (mod 2) for eacha∈A.

Conditions (18) and (21) imply thatx′(a)≡ x′′(a) (mod 2) for eacha ∈A.
Hencex 1 =^12 (x′+x′′) andx 2 =^12 (x′−x”) are integer vectors.

This proof directly yields a polynomial-time algorithm forfinding the integer
solution.

Exercises

```
9.6. Derive from Theorem 9.1 the followingmax-biflow min-cut theoremof Hu: LetG=
(V,E) be a graph, lets 1 ,t 1 ,s 2 ,t 2 be distinct vertices, and letc:E → Q+be a
capacity function. Then the maximum value ofd 1 +d 2 so that there existsi−tiflows
xiof valuedi(i= 1,2), together satisfying the capacity constraint, is equal to the
minimum capacity of a cut both separatings 1 andt 1 and separatings 2 andt 2.
```
```
9.7. Derive from Theorem 9.1 that the cut condition suffices tohave a half-integer solu-
tion to the undirectedk-commodity flow problem (with all capacities and demands
integer), if there exist two verticesuandwso that each commodity{si,ti}intersects
{u,w}. (Dinits (cf. Adel’son-Vel’ski ̆ı, Dinits, and Karzanov [1975]).)
```
```
9.8. Derive the following from Theorem 9.2. LetG= (V,E) be a Eulerian graph and
lets 1 ,t 1 ,s 2 ,t 2 be distinct vertices. Then the maximum numbertof pairwise edge-
disjoint pathsP 1 ,...,Pt, where eachPj connects eithers 1 andt 1 ors 2 andt 2 , is
```

```
Section 9.3. Disjoint paths in acyclic directed graphs 157
```
```
equal to the minimum cardinality of a cut both separatings 1 andt 1 and separating
s 2 andt 2.
```
##### 9.3. Disjoint paths in acyclic directed graphs

```
Fortune, Hopcroft, and Wyllie [1980] showed that the vertex-disjoint paths problem
is NP-complete for directed graphs, even when fixing the number of paths tok= 2.
On the other hand they proved that ifDisacyclic, then for each fixedk, thek
vertex-disjoint paths problem can be solved in polynomial time. (A directed graph is
calledacyclicif it does not contain any directed circuit.)
The algorithm is contained in the proof of the following theorem:
```
```
Theorem 9.3. For each fixedkthere exists a polynomial-time algorithm for thek
vertex-disjoint paths problem for acyclic directed graphs.
```
```
Proof.LetD= (V, A) be an acyclic digraph and lets 1 , t 1 ,... , sk, tkbe vertices of
D, all distinct. In order to solve the vertex-disjoint paths problem we may assume
that eachsiis a source and eachtiis a sink. (Here asourceis a vertex with indegree
0, and asinkis a vertex with outdegree 0.)
Make an auxiliary digraphD′= (V′, A′) as follows. The vertex setV′consists of
allk-tuples (v 1 ,... , vk) of distinct vertices ofD. InD′there is an arc from (v 1 ,... , vk)
to (w 1 ,... , wk) if and only if there exists ani∈{ 1 ,... , k}such that:
```
(22) (i)vj=wjfor allj 6 =i;
(ii) (vi, wi) is an arc ofD;
(iii) for eachj 6 =ithere is no directed path inDfromvj tovi.

```
Now the following holds:
```
```
(23) D containsk vertex-disjoint directed pathsP 1 ,... , Pk such thatPiruns
fromsitoti(i= 1,... , k)
⇐⇒D′contains a directed pathPfrom (s 1 ,... , sk) to (t 1 ,... , tk).
```
```
To see =⇒, letPifollow the verticesvi, 0 , vi, 1 ,... , vi,pifori= 1,... , k. Sovi, 0 =si
andvi,pi=tifor eachi. Choosej 1 ,... , jksuch that 0≤ji≤pifor eachiand such
that:
```
(24) (i)D′contains a directed path from (s 1 ,... , sk) to (v 1 ,j 1 ,... , vk,jk),
(ii)j 1 +···+jkis as large as possible.

```
LetI := {i|ji < pi}. IfI =∅we are done, so assumeI 6 = ∅. Then by the
definition ofD′and the maximality ofj 1 +···+jkthere exists for eachi∈Iani′ 6 =i
```

158 Chapter 9. Multicommodity flows and disjoint paths

such that there is a directed path inDfromvi′,ji′tovi,ji. Sinceti′is a sink we know
thatvi′,ji′ 6 =si′and that hence i′belongs toI. So each vertex in{vi,ji |i∈I}is
end vertex of a directed path inDstarting at another vertex in{vi,ji|i∈I}. This
contradicts the fact thatDis acyclic.
To see⇐= in (23), letPbe a directed path from (s 1 ,... , sk) to (t 1 ,... , tk) inD′.
LetP follow the vertices (v 1 ,j,... , vk,j) forj = 0,... , t. Sovi, 0 =siandvi,t =ti
fori = 1,... , k. For eachi = 1,... , k letPibe the path in D followingvi,j for
j= 0,... , t, taking repeated vertices only once. SoPiis a directed path fromsitoti.
Moreover,P 1 ,... , Pkare pairwise disjoint. For suppose thatP 1 andP 2 (say) have
a vertex in common. That isv 1 ,j=v 2 ,j′for somej 6 =j′. Without loss of generality,
j < j′andv 1 ,j 6 =v 1 ,j+1. By definition ofD′, there is no directed path inDfromv 2 ,j
tov 1 ,j. However, this contradicts the facts thatv 1 ,j=v 2 ,j′ and that there exists a
directed path inDfromv 2 ,jtov 2 ,j′.

One can derive from this that for fixedkalso thekarc-disjoint paths problem is
solvable in polynomial time for acyclic directed graphs (Exercise 9.9).

Application 9.4: Routing airplanes. This application extends Application 4.1. The
data are similar, except that legal rules now prescribe the exact day of the coming week at
which certain airplanes should be at the home basis for maintenance.
Again at Saturday 18.00h the company determines the exact routing for the next week.
One can make the same directed graph as in Application 4.1. Now however it is prescribed
that some of the pathsPishould start at a certain (c,t) (wherecis the city where airplane
aiwill be first after Saturday 18.00h) and that they should traverse the arc corresponding
to maintenance on a prescribed day of the coming week (for instance Wednesday).
Now if for each airplaneaiwhich should be home for maintenance next week we can
find this pathPisuch that it traverses the for that plane required maintenance arc and in
such a way that paths found for different airplanes are arc disjoint, then it is easy to see
that these paths can be extended to pathsP 1 ,...,Pnsuch that each arc is traversed exactly
once.
As the directed graphD is acyclic, the problem can be solved with the algorithm
described in the proof of Theorem 9.3, provided that the number of airplanes that should
be home for maintenance the coming week is not too large.

Exercises

```
9.9. Derive from Theorem 9.3 that for each fixedkthekarc-disjoint paths problem is
solvable in polynomial time for acyclic directed graphs.
9.10. Show that for fixedk, the following problem is solvable in polynomial time:
```
```
(25) given:an acyclic directed graph D= (V,A), pairss 1 ,t 1 ,...,sk,tk of
vertices, and subsetsA 1 ,...,AkofA;
find:pairwise arc-disjoint directed pathsP 1 ,...,Pk, wherePiruns from
sitotiand traverses only arcs inAi(i= 1,...,k).
```

```
Section 9.4. Vertex-disjoint paths in planar graphs 159
```
##### 9.4. Vertex-disjoint paths in planar graphs

```
Finding disjoint paths inplanargraphs is of interest not only for planar communica-
tion or transportation networks, but especially also for the design of VLSI-circuits.
The routing of wires should follow certain channels on layers of the chip. On each
layer, these channels form a planar graph.
Unfortunately, even for planar graphs disjoint paths problems are in general hard.
However, for some special cases, polynomial-time algorithms have been found. Such
algorithms can be used, for example, as subroutines when solving any hard problem
by decomposition. In Sections 9.4 and 9.5 we discuss some of these algorithms.
LetG= (V, E) be a planar graph, embedded in the planeR^2 and let{s 1 , t 1 },... ,{sk, tk}
be pairwise disjoint pairs of vertices. Robertson and Seymour [1986] observed that
there is an easy greedy-type algorithm for the vertex-disjoint paths problem if all
vertices s 1 , t 1 ,... , sk, tk belong to the boundary of one faceI ofG. That is, there
exists a polynomial-time algorithm for the following problem:^21
```
(26) given: a planar graphG= (V, E) embedded inR^2 , a faceIofG, pairs{s 1 , t 1 },... ,{sk, tk}
of vertices on bd(I),
find: pairwise vertex-disjoint pathsP 1 ,... , PkinG, wherePiconnectssiandti
(i= 1,... , k).

```
In fact, we may assume without loss of generality thatIis the unbounded face.
Let us first describe the simple intuitive idea of the method,by explaining the
recursive step in the ‘ideal’ case whereGis connected and where bd(I) is a simple
circuit.
We say that{s, t}and{s′, t′}cross (aroundI) ifs, s′, t, t′are distinct and occur
in this order cyclically around bd(I), clockwise or anti-clockwise (see Figure 9.6).
r
```
```
s
```
```
s’ r’
```
```
r
```
```
s
```
```
r’ s’
```
```
Figure 9.6
```
```
If any{si, ti}and{sj, tj}cross aroundI (for somei 6 =j), problem (26) clearly
has no solution. So we may assume that no pair of commodities crosses. This implies
that there exists aniso that at least one of thesi−tipaths along bd(I) does not
contain anysj ortj forj 6 =i: just chooseiso that the shortestsi−tipath along
bd(I) is shortest among alli= 1,... , k.
```
(^21) bd(I) denotes the boundary ofI.


160 Chapter 9. Multicommodity flows and disjoint paths

Without loss of generality,i=k. LetQbe the shortestsk−tkpath along bd(I).
Delete from Gall vertices inQ, together with all edges incident with them. De-
note the new graph byG′. Next solve the vertex-disjoint paths problem for input
G′,{s 1 , t 1 },... ,{sk− 1 , tk− 1 }. If this gives a solutionP 1 ,... , Pk− 1 , thenP 1 ,... , Pk− 1 , Q
forms a solution to the original problem (trivially).
If the reduced problem turns out to have no solution, then theoriginal problem
also has no solution. This follows from the fact that ifP 1 ,... , Pk− 1 , Pk would be
a solution to the original problem, we may assume without loss of generality that
Pk=Q, since we can ‘push’Pk‘against’ the border bd(I). HenceP 1 ,... , Pk− 1 would
form a solution to the reduced problem.
Although this might give a suggestive sketch of the algorithm, it is not completely
accurate, since the ideal situation need not be preserved throughout the iteration
process. Even if we start with a highly connected graph, after some iterations the
reduced graph might have cut vertices or be disconnected. Soone should be more
precise.
Let us call a sequence (v 1 ,... , vn) of vertices of a connected planar graphGaborder
sequenceif it is the sequence of vertices traversed when following the boundary ofG
clockwise. Thus the graph in Figure 9.7 has border sequence (a, b, c, d, e, c, f, c, g, b).

```
c
```
```
d
```
```
e
f
```
```
h
```
```
g
```
```
b
```
```
a
```
```
Figure 9.7
```
In fact, each cyclic permutation of a border sequence is again a border sequence.
Note that no border sequence will contain... r... s... r... s.. .for any two dis-
tinct vertices. Hence for any two verticessandton the boundary ofGthere is a
unique sequence

(27) P(s, t) = (s, w 1 ,... , wt, t)

with the properties thatP(s, t) is part of a border sequence ofGand thatw 1 ,... , wt
all are distinct fromsandt. Trivially, the vertices inP(s, t) contain ans−tpath.
We say that two disjoint pairs{s, t}and{s′, t′}cross (aroundG) if... s... s′... t... t′...
or... s... t′... t... s′.. .occur in some border sequence ofG. So the followingcross-
freeness conditionis a necessary condition for (26) to have a solution:


Section 9.4. Vertex-disjoint paths in planar graphs 161

(28) No two disjoint commodities{si, ti},{sj, tj}cross (around the same com-
ponent ofG).

Now the algorithm can be described more precisely as follows. First check the cross-
freeness condition. If it is violated, (26) has no solution. If it is satisfied, apply the
following iterative step:

(29) Check for eachi= 1,... , kifsiandtibelong to the same component ofG.
If not, the problem has no solution.
If so, choose i ∈ { 1 ,... , k} for which the shortest among P(si, ti) and
P(ti, si) is as short as possible. Without loss of generality, i = k and
P(sk, tk) is shortest. Take forPk any sk−tk path using the vertices in
P(sk, tk) only.
Ifk= 1, stop. Ifk >1, letG′be the graph obtained fromGby deleting
all vertices occurring in P(sk, tk). Repeat this iterative step forG′ and
{s 1 , t 1 },... ,{sk− 1 , tk− 1 }.
If it gives a solution P 1 ,... , Pk− 1 , then P 1 ,... , Pk− 1 , Pk is a solution to
the original problem. If it gives no solution, the original problem has no
solution.

We leave it as a (technical) exercise to show the correctnessof this algorithm. (The
correctness can be derived also from the proof of Theorem 9.4below.) It clearly is
a polynomial-time method. Recently, Ripphausen-Lipa, Wagner, and Weihe [1997]
found a linear-time algorithm.
Moreover, the method implies a characterization by means ofa cut condition for
the existence of a solution to (26). Asimple closed curveC inR^2 is by definition
a one-to-one continuous function from the unit circle toR^2. We will identify the
functionCwith its image.
We say thatCseparatesthe pair{s, t}if each curve connectingsandtintersects
C. Now the followingcut conditionclearly is necessary for the existence of a solution
to the vertex-disjoint paths problem in planar graphs:

(30) each simple closed curve inR^2 intersectsGat least as often as it separates
pairs{s 1 , t 1 },... ,{sk, tk}.

```
Robertson and Seymour [1986] showed with this method:
```
Theorem 9.4. LetG= (V, E)be a planar graph embedded inR^2 and let{s 1 , t 1 },... ,{sk, tk}
be pairs of vertices on the boundary ofG. Then there exist pairwise vertex-disjoint
pathsP 1 ,... , Pk wherePi connectssiandti(i= 1,... , k) if and only if the cross-
freeness condition(28)and the cut condition(30)hold.

Proof.Necessity of the conditions is trivial. We show sufficiency by induction onk,


162 Chapter 9. Multicommodity flows and disjoint paths

the casek= 0 being trivial. Letk >1 and let (28) and (30) be satisfied. Suppose
pathsP 1 ,... , Pkas required do not exist. Trivially,{s 1 , t 1 },... ,{sk, tk}are pairwise
disjoint (otherwise there would exist a simple closed curveC with|C∩G|= 1 and
intersecting two commodities, thus violating the cut condition).
The induction is based on the iterative step (29). To simplify the argument, we
first show that we may assume thatGis 2-connected.
First, we may assume thatGis connected, as we can decomposeGinto its compo-
nents. (If somesiandtiwould belong to different components, there trivially exists
a closed curveCviolating the cut condition.)
Knowing thatGis connected, the casek= 1 is trivial. So we may assume that
k≥2. SupposeGcontains a cut vertexv. We may assume that each component
ofG−vintersects{s 1 , t 1 ,... , sk, tk}(otherwise we could delete it fromGwithout
violating the cut condition). This implies that we can extendGplanarly by an edge
econnecting some verticesu′andu′′in different components ofG−v, in such a way
thatu′∈{si′, ti′}andu′′∈{si′′, ti′′}for somei′ 6 =i′′and thats 1 , t 1 ,... , sk, tkare still
on the boundary ofG∪e. The cut condition holds forG∪e(a fortiori), but pairwise
vertex-disjointsi−tipaths (i= 1,... , k) do not exist inG∪e(since we cannot make
use of edgee, asi′ 6 =i′′). Repeating this we end up with a 2-connected graph.
IfGis 2-connected, the boundary ofGis a simple circuit. Now we apply the itera-
tive step (29). That is, we find, without loss of generality, that the pathP(sk, tk) from
sktotkclockwise along the boundary ofGdoes not contain anys 1 , t 1 ,... , sk− 1 , tk− 1.
LetPkbe the correspondingsk−tkpath.
Again, letG′be the graph obtained fromGby deleting all vertices inPk, together
with all edges incident with them. LetIandI′denote the unbounded faces ofGand
G′, respectively (we takeIandI′asopenregions). SoI⊆I′.
NowG′does not contain pairwise vertex-disjointsi−tipaths (i= 1,... , k−1),
since by assumptionGdoes not contain pairwise vertex-disjointsi−ti paths (i=
1 ,... , k). Hence, by the induction hypothesis, there exists a simple closed curveC
with|C∩G′|smaller than the number of pairs{s 1 , t 1 },... ,{sk− 1 , tk− 1 }separated by
C. We may assume thatC traverses each of the connected regionsI′, I andI′\I
at most once. That is, each ofC∩I′, C∩IandC∩(I′\I) is connected (possibly
empty).
IfC∩(I′\I) is empty, thenC∩G=C∩G′and henceCviolates the cut condition
also forG. IfC∩Iis empty, thenC does not separate any{si, ti}except for those
intersected byC. ThenC cannot violate the cut condition forG′.
If bothC∩IandC∩(I′\I) are nonempty, we may assume that|C∩G|=|C∩G′|+1
and thatCseparates{sk, tk}(since each face ofGcontained inI′is incident with at
least one vertex onPk). It follows thatCviolates the cut condition forG.

Application 9.5: VLSI-routing. The VLSI-routing problem asks for the routes that
wires should make on a chip so as to connect certain pairs of pins and so that wires con-
necting different pairs of pins are disjoint.
Since the routes that the wires potentially can make form a graph, the problem to be


Section 9.4. Vertex-disjoint paths in planar graphs 163

```
1 2
3
4
```
```
11 12 1
```
```
7
13
```
```
9
16
15
1114
```
```
5 6
7
8
10
```
```
6 5
14
```
```
9
```
```
3
```
```
11
```
```
4 13
```
```
8
```
```
1610
```
(^152)
12
Figure 9.8
solved can be modeled as a disjoint paths problem. Consider an example of such a problem
as in Figure 9.8 — relatively simple, since generally the number of pins to be connected
is of the order of several thousands. The grey areas are ‘modules’ on which the pins are
located. Points with the same label should be connected.
1 2
3
4
11 12 1
7
13
9
16
15
1114
5 6
7
8
10
6 5
14
9
3
11
4 13
8
1610
(^152)
12
Figure 9.9
In the example, the graph is a ‘grid graph’, which is typical in VLSI-design since it
facilitates the manufacturing of the chip and it ensures a certain minimum distance between
disjoint wires. But even for such graphs the disjoint paths problem is NP-complete.
Now the following two-step approach was proposed by Pinter [1983]. First choose the
‘homotopies’ of the wires; for instance like in Figure 9.9. That is, for eachione chooses a
curveCiin the plane connecting the two verticesi, in such a way that they are pairwise
disjoint, and such that the modules are not traversed (Figure 9.9).


164 Chapter 9. Multicommodity flows and disjoint paths

Second, try to find disjoint pathsP 1 ,...,Pkin the graph such thatPiis homotopic to
Ci, in the space obtained from the plane by taking out the rectangles forming the modules;
that is, the pathsPishould be obtained from the curvesCiby shiftingCiover the surface,
but not over any module, fixing the end points of the curve. In Figure 9.10 such a solution
is given.

```
1 2
3
4
```
```
11 12 1
```
```
7
13
```
```
9
16
15
1114
```
```
5 6
7
8
10
```
```
6 5
14
```
```
9
```
```
3
```
```
11
```
```
4 13
```
```
8
```
```
1610
```
(^152)
12
Figure 9.10
It was shown by Leiserson and Maley [1985] that this second step can be performed
in polynomial time. So the hard part of the problem is the firststep: finding the right
topology of the layout.
Cole and Siegel [1984] proved a Menger-type cut theorem characterizing the existence of
a solution in the second step. That is, if there is no solutionfor the disjoint paths problem
given the homotopies, there is an ‘oversaturated’ cut: a curveDconnecting two holes in
the plane and intersecting the graph less than the number of timesDnecessarily crosses
the curvesCi.
This can be used in a heuristic practical algorithm for the VLSI-routing problem: first
guess the homotopies of the solution; second try to find disjoint paths of the guessed ho-
motopies; if you find them you can stop; if you don’t find them, the oversaturated cut will
indicate a bottleneck in the chosen homotopies; amend the bottleneck and repeat.
Similar results hold if one wants to pack trees instead of paths (which is generally
the case at VLSI-design), and the result can be extended to any planar graph (Schrijver
[1991]). As a theoretical consequence one has that for each fixed number of modules, the
planar VLSI-routing problem can be solved in polynomial time.
Exercises
9.11. Extend the algorithm and Theorem 9.4 to the directed case.
9.12. Extend the algorithm and Theorem 9.4 to the followingvertex-disjoint trees problem:


Section 9.5. Edge-disjoint paths in planar graphs 165

```
(31) given:a planar graphG= (V,E), setsR 1 ,...,Rk of vertices on the
boundary ofG,
find:pairwise vertex-disjoint subtreesT 1 ,...,TkofGso thatTicovers
Ri(i= 1,...,k).
9.13. Extend the algorithm and Theorem 9.4 to the following problem:
```
```
(32) given:a planar graphG= (V,E), pairs{s 1 ,t 1 },...,{sk,tk}of vertices
on the boundary ofG, subgraphsG 1 ,...,GkofG,
find:pairwise vertex-disjoint pathsP 1 ,...,PkwherePiconnectssiand
tiand wherePiis inGi(i= 1,...,k).
9.14. (i) Reduce the edge-disjoint paths problem where all commodities are on the bound-
ary of a planar graph so that the cross-freeness condition issatisfied, to the
vertex-disjoint paths problem(26).
(ii) Show that the cut condition (7) is sufficient in this case of the edge-disjoint
paths problem.
```
##### 9.5. Edge-disjoint paths in planar graphs

The trivially necessary cross-freeness condition for the commodities if they are on
the boundary of a planar graph, turned out to be of great help in handling the
vertex-disjoint paths problem: it gives an ordering of the commodities, allowing us to
handling them one by one.
As we saw in Exercise 9.14, the edge-disjoint analogue can be handled in the same
way if the cross-freeness condition holds. In that case, thecut condition (7) is again
sufficient. However, Figure 9.5 shows that without cross-freeness, the cut condition
is not sufficient. That simple example shows that we may not hope for many other
interesting cases where the cut condition is sufficient.
In fact, the complexity of the edge-disjoint paths problem for planar graphs with
all commodities on the boundary, is open. Therefore, we put:

Research problem. Is the undirected edge-disjoint paths problem polynomially
solvable for planar graphs with all commodities on the boundary? Is it
NP-complete?

Okamura and Seymour [1981] showed that the problem is polynomially solvable
if we pose the followingEuler condition:

(33) the graph (V, E∪{{s 1 , t 1 },... ,{sk, tk}}) is Eulerian.

(We have parallel edges if some{si, ti}coincide or form an edge ofG.) Moreover,
they showed that with the Euler condition, the cut conditionis a sufficient condition.
(Thus we have an analogue to Rothschild and Whinston’s theorem (Theorem 9.2).)


166 Chapter 9. Multicommodity flows and disjoint paths

```
We here observe that the Euler condition (33) implies that for eachU⊆V:
```
(34) |δE(U)|≡number ofiwith|U∩{si, ti}|= 1 (mod 2).

Theorem 9.5(Okamura-Seymour theorem). LetG= (V, E)be a planar graph and
let{s 1 , t 1 },... ,{sk, tk}be pairs of vertices on the boundary ofGsuch that the Euler
condition(33)holds. Then the edge-disjoint paths problem has a solution if and only
if the cut condition holds.

Proof. Necessity of the cut condition being trivial, we show sufficiency. The cut
condition implies that|R| ≤ |E|(assuming that eachr∈Rconsists of two distinct
vertices), since

###### (35) 2 |R|=

###### ∑

```
v∈V
```
```
degR(v)≤
```
###### ∑

```
v∈V
```
```
degE(v) = 2|E|.
```
So we can consider a counterexample with 2|E|−|R|minimal. Then

(36) Gis 2-connected.

Indeed, ifGis disconnected, we can deal with the components separately. Suppose
next thatGis connected and has a cut vertexv. We may assume that for nor=
st∈R, the verticessandtbelong to different components ofG−v, since otherwise
we can replacerbysvandvt, without violating the Euler or cut condition. For any
componentKof G−vconsider the graph induced byK∪{v}. Again, the Euler
and cut conditions hold (with respect to those nets contained inK∪{v}). So by the
minimality of 2|E|−|R|, we know that paths as required exist inK∪{v}. As this is
the case for each component ofG−v, we have paths as required inG. This proves
(36).
LetCbe the circuit formed by the outer boundary ofG. If somer∈Rhas the
same ends as some edgeeofG, we can deleteefromGandrfromR, and obtain a
smaller counterexample. So no suchrexists.
Call a subsetXofV tightifdE(X) =dR(X). Then

(37) there exists a tight subsetXofVsuch thatδE(X) intersectsECin precisely
two edges.

Indeed, if there is no tight setXwith∅ 6=X 6 =V, we can choose an edgee∈EC,
and replaceEandRbyE\{e}andR∪{e}. This does not violate the cut condition,
and hence would give a smaller counterexample.
So there exists a tight proper nonempty subsetXofV. ChooseXwith|δE(X)|
minimal. ThenG[X] andG−Xare connected. For suppose that (say)G[X] is not


Section 9.5. Edge-disjoint paths in planar graphs 167

connected. LetKbe a component ofG[X]. Then

(38) |δE(K)|+|δE(X\K)|≥|δR(K)|+|δR(X\K)|≥|δR(X)|
=|δE(X)|=|δE(K)|+|δE(X\K)|.

So K is tight, while|δE(K)|< |δE(X)|, contradicting the minimality assumption.
HenceG[X] andG−Xare connected, implying (37).

Choose a setXas in (37) with|X|minimal. Letebe one of the two edges inEC
that belong toδE(X). Saye=uwwithu6∈Xandw∈X.
SincedR(X) =dE(X)≥2, we knowδR(X) 6 =∅. For eachr∈δR(X), letsrbe
the vertex inr∩X, andtrthe vertex inr\X. Chooser∈δR(X) such thattris as
close as possible touin the graphC−X.
Sincesr andtr are nonadjacent, we know that {sr, tr} 6= {u, w}. So we can
choose v∈ {u, w}\{sr, tr}. LetR′ := (R\{r})∪{srv, vtr}. Trivially the Euler
condition is maintained. We show that also the cut conditionis maintained, yielding
a contradiction as 2|E|−|R′|< 2 |E|−|R|and as a solution forR′yields a solution
forR.
To see that the cut condition is maintained, suppose to the contrary that there is
aY ⊆V satisfying

(39) dE(Y)< dR′(Y).

By choosingY under the additional condition thatdE(Y) is as small as possible, we
have thatG[Y] andG−Yare connected. SoδE(Y) has two edges onC. By symmetry
we can assume thattr6∈Y. By the Euler condition, (39) impliesdE(Y)≤dR′(Y)−2.
So

(40) dR′(Y)≥dE(Y) + 2≥dR(Y) + 2≥dR′(Y).

Hence we have equality throughout. SoδR′(Y) contains bothsrvandvtr, that is,
sr, tr6∈Y andv∈Y. Moreover,dE(Y) =dR(Y).
By the choice ofr, there is no pairr′ inRconnectingX\Y andY \X(since
thentr′∈Y\X, and hencetr′is closer thantrtouinC−X). This implies

(41) dR(X∩Y) +dR(X∪Y) =dR(X) +dR(Y).

Moreover,

(42) dE(X∩Y) +dE(X∪Y)≤dE(X) +dE(Y).

As the cut condition holds forX∩Y andX∪Y, we have equality in (42), and
therefore X∩Y is tight. Sincesr ∈X\Y, we know|X∩Y| <|X|. So by the


168 Chapter 9. Multicommodity flows and disjoint paths

minimality ofXwe haveX∩Y =∅. Sow6∈Y, henceu=v∈Y. Then edgee=uw
connectsX\Y andY\X, contradicting equality in (42).

Clearly, this method gives a polynomial-time algorithm forfinding the paths,
since we can determine a minimum-cardinality cut containinge′ande′′, for any pair
of edgese′, e′′on the boundary ofG(cf. Exercise 9.16).
Becker and Mehlhorn [1986] and Matsumoto, Nishizeki, and Saito [1985] gave
implementations with running time of orderO(|E|^2 ). Recently, Wagner and Weihe
[1995] found a linear-time algorithm.

Exercises

```
9.15. LetG= (V,E) be a finite subgraph of the rectangular grid graph inR^2 , such that
each bounded face ofGis a square of area 1. Let{s 1 ,t 1 },...,{sk,tk}be pairs of
vertices on the boundary ofGsuch that each vertex of (V,E∩{{s 1 ,t 1 },...,{sk,tk}})
has degree even and at most 4. A cut is called a1-bend cutif it is the set of edges
crossed by the union of some horizontal and some vertical half-line with one common
end vertex.
Show that the cut condition holds whenever it holds for all 1-bend cuts.
```
```
9.16. LetGbe a planar graph and lete′ande′′be edges on the boundary ofG. Reduce
the problem of finding a minimum-cardinality cut containinge′ande′′to a shortest
path problem.
```
##### 9.6. A column generation technique for multicommodity flows

##### modity flows

The fractional multicommodity flow problem (1) asks for flowsx 1 ,... , xk of given
values d 1 ,... , dk such that the total amount of flow through any arc e does not
exceed the capacity ofe. So it amounts to finding a solution to the following system
of linear inequalities in thek|E|variablesxi(e) (i= 1,... , k; e∈E):

(43) (i)

###### ∑

```
e∈δout(v)
```
```
xi(e)−
```
###### ∑

```
e∈δin(v)
```
```
xi(e) = 0 (i= 1,... , k; v∈V, v 6 =si, ti),
```
```
(ii)
```
###### ∑

```
e∈δout(si)
```
```
xi(e)−
```
###### ∑

```
e∈δin(si)
```
```
xi(e) =di (i= 1,... , k),
```
```
(iii)
```
```
∑k
```
```
i=1
```
```
xi(e)≤c(e) (e∈E),
```
```
(iv) xi(e)≥ 0 (i= 1,... , k; e∈E).
```

Section 9.6. A column generation technique for multicommodity flows 169

Thus any linear programming method can solve the multicommodity flow problem.
In particular, the problem is solvable in polynomial time.

Since for each fixedi= 1,... , k, a solutionxito (43) is ansi−tiflow, we can
decomposexias a nonnegative combination ofsi−tipaths. That is, there existsi−ti
pathsPi 1 ,... , Piniand nonnegative realszi 1 ,... , zinisatisfying:

(44) (i)

```
∑ni
```
```
j=1
```
```
zijXPij(e) =xj(e) (e∈E),
```
```
(ii)
```
```
∑ni
```
```
j=1
```
```
zij=di.
```
HereXP denotes theincidence vectorofPinQE, that is,XP(e) = 1 ifP traverses
e, and = 0 otherwise.

Hence the multicommodity flow problem amounts to finding pathsPijand non-
negative realszij, wherePijis ansi−tipath, such that:

(45) (i)

```
∑ni
```
```
j=1
```
```
zij=di (i= 1,... , k),
```
```
(ii)
```
```
∑k
```
```
i=1
```
```
∑ni
```
```
j=1
```
```
zijXPij(e)≤c(e) (e∈E).
```
This formulation applies to both the directed and the undirected problems.

Solving (45) again amounts to solving a system of linear inequalities, albeit with
an enormous number of variables: one variable for eachi= 1,... , kand eachsi−ti
path.

Ford and Fulkerson [1958] showed that this large number of variables can be
avoided when solving the problem with the simplex method. The variables can be
handled implicitly by using acolumn generation techniqueas follows.

First convert the problem to a maximization problem. To thisend, add, for each
i = 1,... , k, a vertexs′iand an arcs′isi, with capacity equal todi. Then we can
delete the constraint (45)(i), and maximize

###### ∑

i,jzij over the remaining constraints
(replacingsibys′i). If the maximum value is equal to

###### ∑

i diwe have a solution to
(45). If the maximum value is less, then (45) has no nonnegative solutionzij.

Having this reduction, we see that the problem is equivalent to the following LP-
problem. LetP be the collection of allsi−ti paths for alli = 1,... , k. Then:


170 Chapter 9. Multicommodity flows and disjoint paths

(46) maximize:

###### ∑

```
P∈P
```
```
zP
```
```
subject to: (i)
```
###### ∑

```
P∈P
```
```
zPXP(e)≤c(e) (e∈E),
```
```
(ii) zP≥ 0 (P∈P).
```
When solving (46) with the simplex method we first should add aslack variableze
for eache∈E. Thus ifAdenotes theE×Pmatrix with the incidence vectors of
all paths inP as its columns (in some order) andwis the vector inRP×REwith
wP = 1 (P∈P) andwe= 0 (e∈E), we solve:

###### (47)

```
maximize: wTz
subject to: [A I]z=c,
z≥ 0.
```
Now each simplex tableau is completely determined by the set of variables in the
current basis. So knowing subsetsP′ofPandE′ofE, giving the indices of variables
in the basis, is enough to know implicitly the whole tableau.Note that|P′|+|E′|=E.
So although the tableau is exponentially large, it can be represented in a concise way.

LetB be the matrix consisting of those columns of [A I] corresponding to P′
andE′. So the rows ofBare indexed byEand the columns byP′∪E′. The basic
solution corresponding toBis easily computed: the vectorB−^1 cgives the values for
zP ifP ∈ P′ and forzeife∈E′, while we setzP := 0 ifP 6∈ P′ andze := 0 if
e6∈E′. (Initially,B=I, that isP′=∅andE′=E, so thatzP = 0 for allP∈ P
andze=c(e) for alle∈E.)

Now we should describe pivoting (that is, finding variables leaving and entering
the basis) and checking optimality. Interestingly, it turns out that this can be done
by solving a set of shortest path problems.

First consider the dual variable corresponding to an edgee. It has value (in the
current tableau):

(48) wBB−^1 εe−we=wB(B−^1 )e

where as usualwBdenotes the part of vectorwcorresponding toB(that is, corre-
sponding toP′andE′) and whereεedenotes thee-th unit basis vector inRE(which
is the column corresponding toe in [A I]). Note that the columns ofB−^1 are in-
dexed byE; then (B−^1 )eis the column corresponding toe. Note also thatwe= 0 by
definition.

```
Similarly, the dual variable corresponding to a pathPinPhas value:
```
(49) wBB−^1 XP−wP= [

###### ∑

```
e∈P
```
```
wB(B−^1 )e]− 1.
```

Section 9.6. A column generation technique for multicommodity flows 171

(Note thatXP is the column in [A I] corresponding toP.)
In order to pivot, we should identify a negative dual variable. To this end, we
first check if (48) is negative for some edgee. If so, we choose such an edgeeand
takezeas the variable entering the basis. Selecting the variable leaving the basis now
belongs to the standard simplex routine. We only have to consider that part of the
tableau corresponding toP′, E′ande. We select an elementfinP′∪E′for which
the quotientzf/(B−^1 )f ehas positive denominator and is as small as possible. Then
zfis the variable leaving the basis.
Suppose next that (48) is nonnegative for each edgee. We considerwB(B−^1 )eas
the lengthl(e) ofe. Then for any pathP,

(50)

###### ∑

```
e∈P
```
```
wB(B−^1 )e
```
is equal to the length

###### ∑

e∈Pl(e) ofP. Hence, finding a dual variable (49) of negative
value is the same as finding a path inPof length less than 1.
Such a path can be found by applying any shortest path algorithm: for each
i = 1,... , k, we find a shortest si−ti path (with respect to l). If each of these
shortest paths has length at least 1, we know that all dual variables have nonnegative
value, and hence the current basic solution is optimum.
If we find somesi−tipath P of length less than 1, we choosezP as variable
entering the basis. Again selecting a variable leaving the basis is standard: we select
an elementfinP′∪E′for which the quotientzf/(B−^1 XP)fhas positive denominator
and is as small as possible.
This describes pivoting. In order to avoid “cycling”, we apply a lexicographic rule
for selecting the variable leaving the basis. We order the edges ofGarbitrarily. Now
in case there is a tie in selecting thef∈P′∪E′for which the corresponding quotient
is as small as possible, we choose thef∈P′∪E′for which the vector

(51) (B−^1 )f/(B−^1 )f e (ifeenters the basis),

```
(B−^1 )f/(B−^1 XP)f (ifP enters the basis),
```
is lexicographically as small as possible. In Exercise 9.17we will see that this avoids
cycling.

Exercises

```
9.17. (i) Apply the lexicographic rule above, and consider asimplex tableau, correspond-
ing toP′andE′say. Show that for eachf∈ P′∪E′: ifzf= 0 then the first
nonzero entry in the vector (B−^1 )fis positive. (Use induction on the number
of pivot steps performed.)
(ii) Derive from (i) that, when applying the lexicographic rule, at each pivot iter-
ation, if the objective value of the solution does not increase, then the vector
wBB−^1 increases lexicographically.
```

172 Chapter 9. Multicommodity flows and disjoint paths

```
(iii) Derive that the lexicographic rule leads to termination of the method.
```
```
9.18. Modify the column generation technique to solve the following problem: given a
directed graphG= (V,E), a capacity functionc:E→Q+, commodities (s 1 ,t 1 ),...,
(sk,tk) and ‘profits’p 1 ,...,pk ∈ Q+, find vectorsx 1 ,...,xk inQE and rationals
d 1 ,...,dkso that:
```
```
(52) (i)xiis ansi−tiflow of valuedi(i= 1,...,k),
```
```
(ii)
```
```
∑k
```
```
i=1
```
```
xi(e)≤c(e) (e∈E),
```
```
(iii)
```
```
∑k
```
```
i=1
```
```
pidiis as large as possible.
```
```
9.19. LetPijandzij>0 form a solution to the undirected form of (45) and letW⊆V be
so that the capacity ofδE(W) is equal to the demand ofδR(W). Show that eachPij
intersectsδE(W) at most once.
```
```
9.20. Show that if the multicommodity flow problem has no solution, then Ford and Fulk-
erson’s column generation technique yields a length functionlviolating (9).
```

###### 173

## 10. Matroids

## 10.1. Matroids and the greedy algorithm

```
LetG= (V, E) be a connected undirected graph and letw :E→Zbe a ‘weight’
function on the edges. In Section 1.4 we saw that a minimum-weight spanning tree
can be found quite straightforwardly with Kruskal’s so-calledgreedy algorithm.
The algorithm consists of selecting successively edgese 1 , e 2 ,... , er. If edgese 1 ,... , ek
have been selected, we select an edgee∈Eso that:
```
(1) (i)e6∈{e 1 ,... , ek}and{e 1 ,... , ek, e}is a forest,
(ii)w(e) is as small as possible among all edgesesatisfying (i).

```
We take ek+1 := e. If no e satisfying (1)(i) exists, that is, if{e 1 ,... , ek} forms
a spanning tree, we stop, settingr := k. Then {e 1 ,... , er}is a spanning tree of
minimum weight.
By replacing ‘as small as possible’ in (1)(ii) by ‘as large aspossible’, one obtains
a spanning tree ofmaximumweight.
It is obviously not true that such a greedy approach would lead to an optimal
solution for any combinatorial optimization problem. We could think of such an
approach to find a matching of maximum weight. Then in (1)(i) we replace ‘forest’
by ‘matching’ and ‘small’ by ‘large’. Application to the weighted graph in Figure 10.1
would givee 1 =cd, e 2 =ab.
```
```
1
```
```
3
```
```
a b
```
```
d c
```
```
3
```
```
4
Figure 10.1
```
```
However,abandcddo not form a matching of maximum weight.
It turns out that the structures for which the greedy algorithmdoeslead to an
optimal solution, are thematroids. It is worth studying them, not only because it
enables us to recognize when the greedy algorithm applies, but also because there
exist fast algorithms for ‘intersections’ of two different matroids.
```
```
The concept of matroid is defined as follows. LetXbe a finite set and letIbe a
collection of subsets ofX. Then the pair (X,I) is called amatroidif it satisfies the
following conditions:
```

```
174 Chapter 10. Matroids
```
(2) (i)∅∈I,
(ii) ifY∈IandZ⊆Y thenZ∈I,
(iii) ifY, Z∈Iand|Y|<|Z|thenY∪{x}∈Ifor somex∈Z\Y.

```
For any matroidM= (X,I), a subsetY ofXis calledindependentifY belongs
toI, anddependentotherwise.
LetY⊆X. A subsetBofYis called abasisofYifBis an inclusionwise maximal
independent subset ofY. That is, for any setZ∈IwithB⊆Z⊆Y one hasZ=B.
It is not difficult to see that condition (2)(iii) is equivalent to:
```
```
(3) for any subsetY ofX, any two bases ofY have the same cardinality.
```
```
(Exercise 10.1.) The common cardinality of the bases of a subsetY ofXis called the
rankofY, denoted byrM(Y).
We now show that ifG= (V, E) is a graph andIis the collection of forests in
G, then (E,I) indeed is a matroid. Conditions (2)(i) and (ii) are trivial. To see
that condition (3) holds, letE′⊆E. Then, by definition, each basisY ofE′is an
inclusionwise maximal forest contained inE′. HenceY forms a spanning tree in each
component of the graph (V, E′). SoY has|V|−kelements, wherekis the number
of components of (V, E′). So each basis ofE′has|V|−kelements, proving (3).
A set is called simply abasisif it is a basis ofX. The common cardinality of all
bases is called therankof the matroid. IfIis the collection of forests in a connected
graphG= (V, E), then the bases of the matroid (E,I) are exactly the spanning trees
inG.
```
```
We next show that the matroids indeed are those structures for which the greedy
algorithm leads to an optimal solution. Let X be some finite set and letI be a
collection of subsets ofXsatisfying (2)(i) and (ii).
For any weight functionw:X→Rwe want to find a setY inImaximizing
```
```
(4) w(Y) :=
```
###### ∑

```
y∈Y
```
```
w(y).
```
```
Thegreedy algorithmconsists of selectingy 1 ,... , yrsuccessively as follows. Ify 1 ,... , yk
have been selected, choosey∈Xso that:
```
(5) (i)y6∈{y 1 ,... , yk}and{y 1 ,... , yk, y}∈I,
(ii)w(y) is as large as possible among allysatisfying (i).

```
We stop if noysatisfying (5)(i) exist, that is, if{y 1 ,... , yk}is a basis.
Now:
```
```
Theorem 10.1. The pair(X,I)satisfying(2)(i) and (ii) is a matroid if and only if
```

Section 10.1. Matroids and the greedy algorithm 175

the greedy algorithm leads to a setY inIof maximum weightw(Y), for each weight
functionw:X→R+.

Proof.Sufficiency. Suppose that the greedy algorithm leads to an independent set
of maximum weight for each weight functionw. We show that (X,I) is a matroid.
Conditions (2)(i) and (ii) are satisfied by assumption. To see condition (2)(iii),
letY, Z∈Iwith|Y|<|Z|. Suppose thatY∪{z}6∈Ifor eachz∈Z\Y.
Consider the following weight functionwonX. Letk:=|Y|. Define:

(6) w(x) :=k+ 2 ifx∈Y,
w(x) :=k+ 1 ifx∈Z\Y,
w(x) := 0 ifx∈X\(Y∪Z).

Now in the firstk iterations of the greedy algorithm we find thek elements in
Y. By assumption, at any further iteration, we cannot choose any element inZ\Y.
Hence any further element chosen, has weight 0. So the greedy algorithm will yield a
basis of weightk(k+ 2).
However, any basis containingZwill have weight at least|Z∩Y|(k+ 2) +|Z\
Y|(k+ 1)≥|Z|(k+ 1)≥(k+ 1)(k+ 1)> k(k+ 2). Hence the greedy algorithm does
not give a maximum-weight independent set.

Necessity. Now let (X,I) be a matroid. Letw:X→R+be any weight function on
X. Call an independent setY greedyif it is contained in a maximum-weight basis. It
suffices to show that ifY is greedy, andxis an element inX\Ysuch thatY∪{x}∈I
and such thatw(x) is as large as possible, thenY∪{x}is greedy.
As Y is greedy, there exists a maximum-weight basisB ⊇Y. Ifx∈ B then
Y ∪{x}is greedy again. Ifx6∈B, then there exists a basisB′containingY ∪{x}
and contained inB∪{x}. SoB′= (B\{x′})∪{x}for somex′∈B\Y. Asw(x)
is chosen maximum, w(x)≥ w(x′). Hence w(B′) ≥ w(B), and therefore B′ is a
maximum-weight basis. SoY∪{x}is greedy.

Note that by replacing “as large as possible” in (5) by “as small as possible”, one
obtains an algorithm for finding aminimum-weight basis in a matroid. Moreover,
by ignoring elements of negative weight, the algorithm can be adapted to yield an
independent set of maximum weight, for any weight functionw:X→R.

Exercises

```
10.1. Show that condition (3) is equivalent to condition (2)(iii) (assuming (2)(i) and (ii)).
```
```
10.2. LetM= (X,I) be a matroid. Two elementsx,yofXare calledparallelif{x,y}is
a circuit. Show that ifxandyare parallel andY is an independent set withx∈Y,
then also (Y\{x})∪{y}is independent.
```

```
176 Chapter 10. Matroids
```
```
10.3. LetM= (X,I) be a matroid, withX={x 1 ,...,xm}. Define
```
```
(7) Y :={xi|rM({x 1 ,...,xi})> rM({x 1 ,...,xi− 1 })}.
```
```
Prove thatY belongs toI.
```
## 10.2. Equivalent axioms for matroids

```
The definition of the notion of matroid given in the previous section is given by
‘axioms’ in terms of the independent sets. There are severalother axioms that char-
acterize matroids. In this section we give a number of them.
LetX be a finite set, and letI be a nonempty down-monotone collection of
subsets ofX; that is, ifF∈ I andF′⊆F, thenF′∈ I. LetBbe the collection of
inclusionwise maximal sets inI, and letCbe the collection of inclusionwise minimimal
sets that arenotinI. Finally, for any subsetY ofX, define
```
```
(8) r(Y) := max{|Z||Z⊆Y, Z∈I}.
```
```
Obviously, knowing one of the objectsI,B,C,r, we know all the other. Moreover,
any nonempty antichain^22 Barises in this way from some nonempty down-monotone
collectionIof subsets. Similarly, any antichainCconsisting of nonempty sets arises
in this way. Finally,rarises in this way if and only if
```
(9) (i)r(∅) = 0,
(ii) ifZ⊆Y⊆Xthenr(Z)≤r(Y).

```
We can now characterize when such objects arise from a matroid (X,I). That is,
we obtain the following equivalent characterizations of matroids.
```
```
Theorem 10.2.LetI,B,C, andrbe as above. Then the following are equivalent:
```
```
(i) ifF, F′∈Iand|F′|>|F|, thenF∪{x}∈Ifor somex∈F′\F;
(ii)ifB, B′∈Bandx∈B′\B, then(B′\{x})∪{y}∈Bfor somey∈B\B′;
(iii)ifB, B′∈Bandx∈B′\B, then(B\{y})∪{x}∈Bfor somey∈B\B′;
(iv)ifC, C′∈CwithC 6 =C′andx∈C∩C′, then(C∪C′)\{x}contains a set in
C;
(v) ifC, C′∈C,x∈C∩C′, andy∈C\C′, then(C∪C′)\{x}contains a set in
Ccontainingy;
(vi)for allY, Z⊆Xone has
```
(^22) Anantichainis a collection of sets no two of which are contained in each other.


Section 10.2. Equivalent axioms for matroids 177

```
(10) r(Y∩Z) +r(Y ∪Z)≤r(Y) +r(Z).
```
Proof.(i)⇒(ii): (i) directly implies that all sets inBhave the same size. Now let
B, B′∈ Bandx∈B′\B. SinceB′\{x} ∈ I, by (i) there exists ay∈B\B′such
thatB′′:= (B′\{x})∪{y}∈I. Since|B′′|=|B′|, we knowB′′∈B.

(iii)⇒(i): LetF, F′form a counterexample to (i) with|F∩F′|as large as possible.
Consider setsB, B′inBwithF⊆BandF′⊆B′.
AsF, F′ is a counterexample, we knowF 6⊆B′. Choosex∈F\B′. Then by
(iii), (B′\{y})∪{x}for somey∈B′\B. Hence replacingF′by (F′\{y})∪{x}we
would keep a counterexample but increase|F∩F′|, a contradiction.

(ii)⇒(iii): By the foregoing we know that (iii) implies (ii). Now axioms (ii) and
(iii) interchange if we replaceBby the collection of complements of sets inB. Hence
also the implication (ii)⇒(iii) holds.

(i)⇒(v): If (i) holds, then by the foregoing, also (ii) holds. LetC, C′ ∈ Cand
x∈C∩C′, y∈C\C′. We can assume thatX =C∪C′. LetB, B′ ∈ B with
B⊇C\{y}andB′⊇C′\{x}. Theny6∈Bandx6∈B′(sinceC6⊆BandC′6⊆B′).
We can assume thaty6∈B′. Otherwise,y∈B′\B, and hence by (ii), there exists
az∈B\B′withB′′:= (B′\{y})∪{z}∈B. Thenz 6 =x, since otherwiseC′⊆B′′.
Hence, replacingB′byB′′givesy6∈B′.
Asy6∈B′, we knowB′∪{y} 6∈ I, and hence there exists aC′′∈ Ccontained in
B′∪{y}. AsC′′6⊆B′, we knowy∈C′′. Moreover, asx6∈B′we knowx6∈C′′.

(v)⇒(iv): is trivial.
(iv)⇒(i): LetF, F′form a counterexample to (i) with|F∩F′|maximal. Then
F6⊆F′, and so we can choosey∈F\F′. By the maximality of|F∩F′|, we know
F′∪{x} 6∈ I. So there is aC ∈ Ccontained inF′∪{x}. AsC 6⊆F′ we know
x∈C. ThenC is the unique set inC contained inF′∪{x}. For suppose there is
another,C′say. Again,x∈C′, and hence by (iv) there exists aC′′∈Ccontained in
(C∪C′)\{x}. But thenC′′⊆F′, a contradiction.
AsC6⊆F,CintersectsF′\F. Choosey∈C∩(F′\F). ThenF′′:= (F′∪{x})\{y}
does not contain any set in C (as C is the only set in C contained in F′∪ {x}).
Then replacingF′byF′′, we would keep a counterexample while increasing|F′∩F|,
contradicting our assumption.

(i)⇒(vi): ChooseY, Z ⊆X. LetF be an inclusionwise maximal set inI with
F⊆Y∩Z, and letF′be an inclusionwise maximal set inIwithF⊆F⊆Y∪Z.
By (i) we know thatr(Y∩Z) =|F|andr(Y∪Z) =|F′|. Then

###### (11) |F′∩Y|+|F′∩Z|=|F′∩(Y∩Z)|+|F′∩(Y∪Z)|≥|F|+|F′|,

and hence we have (10).


178 Chapter 10. Matroids

(vi)⇒(i): LetF, F′ ∈ Iwith|F|<|F′|. LetU be the largest subset ofF′\F
withr(F∪U) =|F|. ThenU 6 =F′\F, sincer(F∪F′)≥|F′|>|F|. So there exists
anx∈F′\F∪U. IfF∪{x}∈Iwe are done, so we can assume thatF∪{x}6∈I;
equivalently,r(F∪{x}) =|F|. LetU′:=U∪{x}. Then by (10),

(12) r(F∪U′)≤r(F∪U) +r(F∪{x})−r(F) =|F|,

contradicting the maximality ofU.

Given a matroidM= (X,I), any inBis called abasisand any set inCacircuit
ofM. The functionris calledrank functionofM (often denoted byrM), andr(Y)
therankofY.

The symmetry of (ii) and (iii) in Theorem 10.2 immediately implies the following.
Define

###### (13) B∗:={X\B|B∈B}.

Then

Corollary 10.2a.IfBis the collection of bases of some matroidM, thenB∗also is
the collection of bases of some matroid onX, denoted byM∗.

Proof.Directly from the equivalence of (ii) and (iii) in Theorem 10.2.

The matroidM∗ is called thedual matroidof M. Since (B∗)∗ = B, we know
(M∗)∗=M.

Theorem 10.3.The rank functionrM∗of the dual matroidM∗satisfies:

(14) rM∗(Y) =|Y|+rM(X\Y)−rM(X).

Proof.

(15) rM∗(Y) = max{|A∩Y||A∈B∗}=
=|Y|−min{|B∩Y||B∈B}=|Y|−rM(X) + max{|B\Y||B∈B}=
|Y|−rM(X) +rM(X\Y).

Another way of constructing matroids from matroids is by ‘deletion’ and ‘contrac-
tion’. LetM= (X,I) be a matroid and letY ⊆X. Define


Section 10.2. Equivalent axioms for matroids 179

###### (16) I′:={Z|Z⊆Y, Z∈I}.

ThenM′= (Y,I′) is a matroid again, as one easily checks.M′is called therestriction
ofM toY. IfY =X\Z withZ ⊆X, we say thatM′ arises bydeletingZ, and
denoteM′byM\Z.
ContractingZ means replacing M by (M∗\Z)∗. This matroid is denoted by
M/Z. One may check that ifGis a graph andeis an edge ofG, then contracting
edge{e}in the cycle matroidM(G) ofGcorresponds to contractingein the graph.
That is,M(G)/{e}=M(G/{e}), whereG/{e}denotes the graph obtained fromG
by contractinge.
If matroidM′arises fromMby a series of deletions and contractions,M′is called
aminorofM.

Exercises

```
10.4. (i) LetXbe a finite set and letkbe a natural number. LetI:={Y ⊆X||Y|≤k}.
Show that (X,I) is a matroid. Such matroids are calledk-uniform matroids.
(ii) Show thatk-uniform matroids are transversal matroids. Give an example of a
k-uniform matroid that is neither graphic nor cographic.
```
```
10.5. LetM= (X,I) be a matroid and letkbe a natural number. DefineI′:={Y ∈ I |
|Y|≤k}. Show that (X,I′) is again a matroid (called thek-truncationofM).
```
```
10.6. LetM= (X,I) be a matroid, letU be a set disjoint fromX, and letk≥0. Define
```
```
(17) I′:={U′∪Y |U′⊆U,Y∈I,|U′∪Y|≤k}.
```
```
Show that (U∪X,I′) is again a matroid.
```
```
10.7. LetM= (X,I) be a matroid and letx∈X.
```
```
(i) Show that ifxis not a loop, then a subsetY ofX\{x}is independent in the
contracted matroidM/{x}if and only ifY∪{x}is independent inM.
(ii) Show that ifxis a loop, thenM/{x}=M\{x}.
(iii) Show that for eachY ⊆X:rM/{x}(Y) =rM(Y∪{x})−rM({x}).
```
```
10.8. LetM= (X,I) be a matroid and letY⊆X.
```
```
(ii) LetBbe a basis ofY. Show that a subsetU ofX\Y is independent in the
contracted matroidM/Y if and only ifU∪Bis independent inM.
(ii) Show that for eachU⊆X\Y
```
```
(18) rM/Y(U) =rM(U∪Y)−rM(Y).
```

```
180 Chapter 10. Matroids
```
```
10.9. LetM= (X,I) be a matroid and letY,Z⊆X. Show that (M\Y)/Z= (M/Z)\Y.
(That is, deletion and contraction commute.)
```
10.10. LetM= (X,I) be a matroid, and suppose that we can test in polynomial timeif
any subsetY ofXbelongs toI. Show that then the same holds for the dual matroid
M∗.

## 10.3. Examples of matroids

```
In this section we describe some classes of examples of matroids.
```
```
I. Graphic matroids. As a first example we consider the matroids described in
Section 10.1.
LetG= (V, E) be a graph. LetIbe the collection of all forests inG. Then
M= (E,I) is a matroid, as we saw in Section 10.1.
The matroidM is called thecycle matroidofG, denoted byM(G). Any matroid
obtained in this way, or isomorphic to such a matroid, is called agraphic matroid.
Note that the bases ofM(G) are exactly those forestsFofGfor which the graph
(V, F) has the same number of components asG. So ifGis connected, the bases are
the spanning trees.
Note also that the circuits ofM(G), in the matroid sense, are exactly the circuits
ofG, in the graph sense.
```
```
II. Cographic matroids.There is an alternative way of obtaining a matroid from
a graphG= (V, E). It is in fact the matroid dual of the graphic matroid.
LetBbe the set of subsetsJ ofEsuch thatE\J is an inclusionwise maximal
forest. By Corollary 10.2a,Bforms the collection of bases of a matroid. Its collection
Iof independent sets consists of those subsetsJ ofEfor which
```
```
(19) κ(V, E\J) =κ(V, E).
```
```
where, for any graphH, letκ(H) denote the number of components ofH.
The matroid (E,I) is called thecocycle matroidofG, denoted byM∗(G). Any
matroid obtained in this way, or isomorphic to such a matroid, is called acographic
matroid.
By definition, a subsetCofEis a circuit ofM∗(G) if it is an inclusionwise minimal
set with the property that (V, E\C) has more components thanG. HenceC is a
circuit ofM∗(G) if and only ifCis an inclusionwise minimal nonempty cutset inG.
```
```
III. Linear matroids. LetAbe anm×nmatrix. LetX={ 1 ,... , n}and letI
be the collection of all those subsetsY ofXso that the columns with index inY are
```

Section 10.3. Examples of matroids 181

linearly independent. That is, so that the submatrix ofAconsisting of the columns
with index inY has rank|Y|.
Now:

Theorem 10.4.(X,I)is a matroid.

Proof.Again, conditions (2)(i) and (ii) are easy to check. To see condition (2)(iii), let
Y andZbe subsets ofXso that the columns with index inYare linearly independent,
and similarly forZ, and so that|Y|<|Z|.
Suppose thatY∪{x}6∈Ifor eachx∈Z\Y. This means that each column with
index inZ\Y is spanned by the columns with index inY. Trivially, each column
with index inZ∩Y is spanned by the columns with index inY. Hence each column
with index inZis spanned by the columns with index inY. This contradicts the fact
that the columns indexed byY span an|Y|-dimensional space, while the columns
indexed byZspan an|Z|-dimensional space, with|Z|>|Y|.

Any matroid obtained in this way, or isomorphic to such a matroid, is called a
linear matroid.
Note that the rankrM(Y) of any subsetY ofXis equal to the rank of the matrix
formed by the columns indexed byY.

IV. Transversal matroids. LetX 1 ,... , Xm be subsets of the finite setX. A set
Y ={y 1 ,... , yn}is called apartial transversal(ofX 1 ,... , Xm), if there exist distinct
indicesi 1 ,... , inso thatyj∈Xijforj= 1,... , n. A partial transversal of cardinality
mis called atransversal(or asystem of distinct representatives, or anSDR).
Another way of representing partial transversals is as follows. LetGbe the bipar-
tite graph with vertex setV:={ 1 ,... , m}∪Xand with edges all pairs{i, x}with
i∈{ 1 ,... , m}andx∈Xi. (We assume here that{ 1 ,... , m}∩X=∅.)
For any matchingM inG, letρ(M) denote the set of those elements inXthat
belong to some edge inM. Then it is not difficult to see that:

(20) Y ⊆Xis a partial transversal if and only ifY =ρ(M) for some matching
M inG.

```
Now letIbe the collection of all partial transversals forX 1 ,... , Xm. Then:
```
Theorem 10.5.(X,I)is a matroid.

Proof.Again, conditions (2)(i) and (ii) are trivial. To see (2)(iii), letY andZbe
partial transversals with|Y|<|Z|. Consider the graphG constructed above. By
(20) there exist matchingsM andM′inGso thatY =ρ(M) andZ =ρ(M′). So
|M|=|Y|<|Z|=|M′|.
Consider the unionM∪M′ofMandM′. Each component of the graph (V, M∪


```
182 Chapter 10. Matroids
```
```
M′) is either a path, or a circuit, or a singleton vertex. Since|M′|>|M|, at least
one of these components is a pathP with more edges inM′than inM. The path
consists of edges alternatingly inM′and inM, with end edges inM′.
LetN andN′ denote the edges inP occurring in M andM′, respectively. So
|N′| = |N|+ 1. Since P has odd length, exactly one of its end vertices belongs
toX; call this end vertex x. Thenx∈ρ(M′) = Z andx6∈ ρ(M) =Y. Define
M′′:= (M\N)∪N′. Clearly,M′′is a matching withρ(M′′) =Y∪{x}. SoY∪{x}
belongs toI.
```
```
Any matroid obtained in this way, or isomorphic to such a matroid, is called a
transversal matroid. If the setsX 1 ,... , Xmform a partition ofX, one speaks of a
partition matroid.
```
```
These four classes of examples show that the greedy algorithm has a wider appli-
cability than just for finding minimum-weight spanning trees. There are more classes
of matroids (like ‘algebraic matroids’, ‘gammoids’), for which we refer to Welsh [1976].
```
```
Exercises
```
10.11. Show that a partition matroid is graphic, cographic,and linear.

10.12. LetM= (V,I) be the transversal matroid derived from subsetsX 1 ,...,XmofXas
in Example IV.

```
(i) Show with K ̋onig’s matching theorem that:
```
```
(21) rM(X) = min
J⊆{ 1 ,...,m}
```
```
(
```
```
∣
∣
```
```
⋃
```
```
j∈J
```
```
Xj
```
```
∣
∣+m−|J|).
```
```
(ii) Derive a formula forrM(Y) for anyY ⊆X.
```
10.13. LetG= (V,E) be a graph. LetIbe the collection of those subsetsY ofEso thatF
has at most one circuit. Show that (E,I) is a matroid.

10.14. LetG= (V,E) be a graph. Call a collectionCof circuits acircuit basisofGif each
circuit ofGis a symmetric difference of circuits inC. (We consider circuits as edge
sets.)
Give a polynomial-time algorithm to find a circuit basis∑ C of Gthat minimizes
C∈C|C|.
(The running time of the algorithm should be bounded by a polynomial in|V|+|E|.)

10.15. LetG= (V,E) be a connected graph. For each subsetE′ofE, letκ(V,E′) denote
the number of components of the graph (V,E′). Show that for eachE′⊆E:

```
(i) rM(G)(E′) =|V|−κ(V,E′);
```

```
Section 10.4. Two technical lemmas 183
```
```
(ii)rM∗(G)(E′) =|E′|−κ(V,E\E′) + 1.
```
10.16. LetGbe a planar graph and letG∗be a planar graph dual toG. Show that the cycle
matroidM(G∗) ofG∗is isomorphic to the cocycle matroidM∗(G) ofG.

10.17. Show that the dual matroid of a linear matroid is againa linear matroid.

10.18. LetG= (V,E) be a loopless undirected graph. LetAbe the matrix obtained from
theV×Eincidence matrix ofGby replacing in each column, exactly one of the two
1’s by−1.

```
(i) Show that a subsetY ofEis a forest if and only if the columns ofAwith index
inY are linearly independent.
(ii) Derive that any graphic matroid is a linear matroid.
(iii) Derive (with the help of Exercise 10.17) that any cographic matroid is a linear
matroid.
```
## 10.4. Two technical lemmas

```
In this section we prove two technical lemmas as a preparation to the coming sections
on matroid intersection.
LetM= (X,I) be a matroid. For anyY ∈ Idefine a bipartite graphH(M, Y)
as follows. The graphH(M, Y) has vertex setX, with colour classesY andX\Y.
Elementsy∈Y andx∈X\Y are adjacent if and only if
```
```
(22) (Y\{y})∪{x}∈I.
```
```
Then we have:
```
```
Lemma 10.1. LetM= (X,I)be a matroid and letY, Z∈ Iwith|Y|=|Z|. Then
H(M, Y)contains a perfect matching onY△Z.^23
```
```
Proof.Suppose not. By K ̋onig’s matching theorem there exist a subsetSofY \Z
and a subsetS′ofZ\Y such that for each edge{y, z}ofH(M, Y) satisfyingz∈S′
one hasy∈Sand such that|S|<|S′|.
As |(Y ∩Z)∪S| < |(Y ∩Z)∪S′|, there exists an elementz ∈ S′ such that
T := (Y ∩Z)∪S∪{z}belongs toI. This implies that there exists anU∈ I such
thatT ⊆U⊆T∪Y and|U|=|Y|. SoU = (Y\{x})∪{z}for somex6∈S. As
{x, z}is an edge ofH(M, Y) this contradicts the choice ofSandS′.
```
```
The following forms a counterpart:
```
(^23) Aperfect matching ona vertex setUis a matchingMwith⋃M=U.


```
184 Chapter 10. Matroids
```
```
Lemma 10.2. LetM= (X,I)be a matroid and letY∈I. LetZ⊆Xbe such that
|Y|=|Z| and such thatH(M, Y)contains a unique perfect matchingN onY△Z.
ThenZ belongs toI.
```
```
Proof.By induction onk:=|Z\Y|, the casek= 0 being trivial. Letk≥1.
By the unicity ofNthere exists an edge{y, z}∈N, withy∈Y\Zandz∈Z\Y,
with the property that there is noz′∈Z\Y such thatz′ 6 =zand{y, z′}is an edge
ofH(M, Y).
LetZ′:= (Z\{z})∪{y}andN′:=N\{{y, z}}. ThenN′is the unique matching
inH(M, Y) with unionY△Z′. Hence by induction,Z′belongs toI.
There exists anS∈ I such thatZ′\{y} ⊆S ⊆(Y \{y})∪Z and|S|=|Y|
(since (Y\{y})∪Z= (Y\{y})∪{z}∪Z′and since (Y\{y})∪{z}belongs toI).
AssumingZ 6∈ I, we knowz6∈Sand hencer((Y ∪Z′)\{y}) =|Y|. Hence there
exists anz′∈Z′\Y such that (Y\{y})∪{z′}belongs toI. This contradicts the
choice ofy.
```
```
Exercises
```
10.19. LetM= (X,I) be a matroid, letBbe a basis ofM, and letw:X→Rbe a weight
function. Show thatBis a basis of maximum weight if and only ifw(B′)≤w(B) for
every basisB′with|B′\B|= 1.

10.20. LetM= (X,I) be a matroid and letY andZbe independent sets with|Y|=|Z|.
For anyy∈Y\Zdefineδ(y) as the set of thosez∈Z\Y which are adjacent toy
in the graphH(M,Y).

```
(i) Show that for eachy∈Y\Zthe set (Z\δ(y))∪{y}belongs toI.
(Hint:Apply inequality (10) toX′:= (Z\δ(y))∪{y}andX′′:= (Z\δ(y))∪
(Y\{y}).)
(ii) Derive from (i) that for eachy∈Y\Zthere exists anz∈Z\Y so that{y,z}
is an edge both ofH(M,Y) and ofH(M,Z).
```
## 10.5. Matroid intersection

```
Edmonds [1970] discovered that the concept of matroid has even more algorithmic
power, by showing that there exist fast algorithms also forintersectionsof matroids.
LetM 1 = (X,I 1 ) andM 2 = (X,I 2 ) be two matroids, on the same setX. Consider
the collectionI 1 ∩I 2 ofcommon independent sets. The pair (X,I 1 ∩I 2 ) is generally
nota matroid again (cf. Exercise 10.21).
What Edmonds showed is that, for any weight functionw onX, a maximum-
weight common independent set can be found in polynomial time. In particular, a
common independent set of maximum cardinality can be found in polynomial time.
We consider first some applications.
```

Section 10.5. Matroid intersection 185

Example 10.5a. LetG= (V, E) be a bipartite graph, with colour classesV 1 and
V 2 , say. LetI 1 be the collection of all subsetsFofEso that no two edges inFhave
a vertex inV 1 in common. Similarly, letI 2 be the collection of all subsetsFofEso
that no two edges inFhave a vertex inV 2 in common. So both (X,I 1 ) and (X,I 2 )
are partition matroids.
NowI 1 ∩ I 2 is the collection of matchings inG. Finding a maximum-weight
common independent set amounts to finding a maximum-weight matching inG.

Example 10.5b. LetX 1 ,... , XmandY 1 ,... , Ymbe subsets ofX. LetM 1 = (X,I 1 )
andM 2 = (X,I 2 ) be the corresponding transversal matroids.
Then common independent sets correspond to common partial transversals. The
collections (X 1 ,... , Xm) and (Y 1 ,... , Ym) have a common transversal if and only if
the maximum cardinality of a common independent set is equaltom.

Example 10.5c.LetD= (V, A) be a directed graph. LetM 1 = (A,I 1 ) be the cycle
matroid of the underlying undirected graph. LetI 2 be the collection of subsetsY of
Aso that each vertex ofDis entered by at most one arc inY. SoM 2 := (A,I 2 ) is a
partition matroid.
Now the common independent sets are those subsetsY ofAwith the property
that each component of (V, Y) is a rooted tree. Moreover,Dhas a rooted spanning
tree if and only if the maximum cardinality of a set inI 1 ∩I 2 is equal to|V|−1.

Example 10.5d. LetG = (V, E) be a connected undirected graph. ThenGhas
two edge-disjoint spanning trees if and only if the maximum cardinality of a common
independent set in the cycle matroidM(G) ofGand the cocycle matroidM∗(G) of
Gis equal to|V|−1.

In this section we describe an algorithm for finding a maximum-cardinality com-
mon independent sets in two given matroids. In the next section we consider the
more general maximum-weight problem.
For any two matroidsM 1 = (X,I 1 ) andM 2 = (X,I 2 ) and anyY ∈ I 1 ∩I 2 , we
define a directed graphH(M 1 , M 2 , Y) as follows. Its vertex set isX, while for any
y∈Y, x∈X\Y,

(23) (y, x) is an arc ofH(M 1 , M 2 , Y) if and only if (Y\{y})∪{x}∈I 1 ,
(x, y) is an arc ofH(M 1 , M 2 , Y) if and only if (Y\{y})∪{x}∈I 2.

These are all arcs ofH(M 1 , M 2 , Y). In fact, this graph can be considered as the union
of directed versions of the graphsH(M 1 , Y) andH(M 2 , Y) defined in Section 10.4.
The following is the basis for finding a maximum-cardinalitycommon independent
set in two matroids.

Cardinality common independent set augmenting algorithm


186 Chapter 10. Matroids

input:matroidsM 1 = (X,I 1 ) andM 2 = (X,I 2 ) and a setY ∈I 1 ∩I 2 ;
output: a setY′∈I 1 ∩I 2 with|Y′|>|Y|, if it exists.
description of the algorithm:We assume thatM 1 andM 2 are given in such a way
that for any subsetZofXwe can check in polynomial time ifZ∈I 1 and ifZ∈I 2.
Consider the sets

(24) X 1 :={y∈X\Y |Y ∪{y}∈I 1 },
X 2 :={y∈X\Y |Y ∪{y}∈I 2 }.

Moreover, consider the directed graphH(M 1 , M 2 , Y) defined above. There are two
cases.

Case 1.There exists a directed pathPinH(M 1 , M 2 , Y)from some vertex inX 1 to
some vertex inX 2 .(Possibly of length 0 ifX 1 ∩X 26 =∅.)
We take a shortest such pathP(that is, with a minimum number of arcs). LetP
traverse the verticesy 0 , z 1 , y 1 ,... , zm, ymofH(M 1 , M 2 , Y), in this order. By construc-
tion of the graphH(M 1 , M 2 , Y) and the setsX 1 andX 2 , this implies thaty 0 ,... , ym
belong toX\Y andz 1 ,... , zmbelong toY.
Now output

(25) Y′:= (Y\{z 1 ,... , zm})∪{y 0 ,... , ym}.

Case 2. There is no directed path inH(M 1 , M 2 , Y)from any vertex inX 1 to any
vertex vertex inX 2 .ThenY is a maximum-cardinality common independent set.

This finishes the description of the algorithm. The correctness of the algorithm is
given in the following two theorems.

Theorem 10.6.If Case 1 applies, thenY′∈I 1 ∩I 2.

Proof.Assume that Case 1 applies. By symmetry it suffices to show thatY′belongs
toI 1.
To see thatY′\{y 0 }belongs toI 1 , consider the graphH(M 1 , Y) defined in Section
10.4. Observe that the edges{zj, yj}form the only matching inH(M 1 , Y) with union
equal to{z 1 ,... , zm, y 1 ,... , ym}(otherwisePwould have a shortcut). So by Lemma
10.2,Y′\{y 0 }= (Y\{z 1 ,... , zm})∪{y 1 ,... , ym}belongs toI 1.
To show thatY′belongs toI 1 , observe thatrM 1 (Y∪Y′)≥rM 1 (Y∪{y 0 }) =|Y|+1,
and that, as (Y′\{y 0 })∩X 1 =∅,rM 1 ((Y∪Y′)\{y 0 }) =|Y|. AsY′\{y 0 }∈I 1 , we
knowY′∈I 1.

Theorem 10.7. If Case 2 applies, thenY is a maximum-cardinality common inde-


Section 10.5. Matroid intersection 187

pendent set.

Proof.As Case 2 applies, there is no directedX 1 −X 2 path inH(M 1 , M 2 , Y). Hence
there is a subsetUofXcontainingX 2 such thatU∩X 1 =∅and such that no arc of
H(M 1 , M 2 , Y) entersU. (We can take forUthe set of vertices that are not reachable
by a directed path fromX 1 .)
We show

(26) rM 1 (U) +rM 2 (X\U) =|Y|.

```
To this end, we first show
```
(27) rM 1 (U) =|Y∩U|.

Clearly, asY∩U∈I 1 , we knowrM 1 (U)≥|Y∩U|. SupposerM 1 (U)>|Y∩U|. Then
there exists anxinU\Y so that (Y∩U)∪{x}∈I 1. SinceY ∈I 1 , this implies that
there exists a setZ∈ I 1 with|Z| ≥ |Y|and (Y∩U)∪{x} ⊆Z⊆Y∪{x}. Then
Z=Y∪{x}orZ= (Y\{y})∪{x}for somey∈Y\U.

In the first alternative,x∈X 1 , contradicting the fact thatxbelongs toU. In the
second alternative, (y, x) is an arc ofH(M 1 , M 2 , Y) enteringU. This contradicts the
definition ofU(asy6∈U andx∈U).
This shows (27). Similarly we have thatrM 2 (X\U) =|Y\U|. Hence we have
(26).

```
Now (26) implies that for any setZinI 1 ∩I 2 one has
```
(28) |Z|=|Z∩U|+|Z\U|≤rM 1 (U) +rM 2 (X\U) =|Y|.

SoY is a common independent set of maximum cardinality.

The algorithm clearly has polynomially bounded running time, since we can con-
struct the auxiliary directed graphH(M 1 , M 2 , Y) and find the pathP(if it exists),
in polynomial time.
It implies the result of Edmonds [1970]:

Theorem 10.8. A maximum-cardinality common independent set in two matroids
can be found in polynomial time.

Proof.Directly from the above, as we can find a maximum-cardinalitycommon inde-
pendent set after applying at most|X|times the common independent set augmenting
algorithm.

```
The algorithm also yields a min-max relation for the maximumcardinality of a
```

```
188 Chapter 10. Matroids
```
```
common independent set, as was shown again by Edmonds [1970].
```
```
Theorem 10.9 (Edmonds’ matroid intersection theorem). LetM 1 = (X,I 1 )and
M 2 = (X,I 2 )be matroids. Then
```
```
(29) max
Y∈I 1 ∩I 2
|Y|= min
U⊆X
(rM 1 (U) +rM 2 (X\U)).
```
```
Proof.The inequality≤follows similarly as in (28). The reverse inequality follows
from the fact that if the algorithm stops with setY, we obtain a setUfor which (26)
holds. Therefore, the maximum in (29) is at least as large as the minimum.
```
```
Exercises
```
10.21. Give an example of two matroidsM 1 = (X,I 1 ) andM 2 = (X,I 2 ) so that (X,I 1 ∩I 2 )
isnota matroid.

10.22. Derive K ̋onig’s matching theorem from Edmonds’ matroid intersection theorem.

10.23. Let (X 1 ,...,Xm) and (Y 1 ,...,Ym) be subsets of the finite setX. Derive from Ed-
monds’ matroid intersection theorem: (X 1 ,...,Xm) and (Y 1 ,...,Ym) have a common
transversal if and only if

```
(30)
```
```
∣∣
(
```
```
⋃
```
```
i∈I
```
```
Xi)∩(
```
```
⋃
```
```
j∈J
```
```
Yj)
```
```
∣∣
≥|I|+|J|−m
```
```
for all subsetsIandJof{ 1 ,...,m}.
```
10.24. Reduce the problem of finding a Hamiltonian cycle in a directed graph to the problem
of finding a maximum-cardinality common independent set inthreematroids.

10.25. LetG= (V,E) be a graph and let the edges ofGbe coloured with|V|−1 colours.
That is, we have partitionedEinto classesX 1 ,...,X|V|− 1 , calledcolours. Show that
there exists a spanning tree with all edges coloured differently if and only if (V,E′)
has at most|V|−tcomponents, for any unionE′oftcolours, for anyt≥0.

10.26. LetM= (X,I) be a matroid and letX 1 ,...,Xmbe subsets ofX. Then (X 1 ,...,Xm)
has an independent transversal if and only if the rank of the union of anytsets among
X 1 ,...,Xmis at leastt, for anyt≥0. (Rado [1942].)

10.27. LetM 1 = (X,I 1 ) andM 2 = (X,I 2 ) be matroids. Define

```
(31) I 1 ∨I 2 :={Y 1 ∪Y 2 |Y 1 ∈I 1 ,Y 2 ∈I 2 }.
```
```
(i) Show that the maximum cardinality of a set inI 1 ∨I 2 is equal to
```

```
Section 10.5. Matroid intersection 189
```
```
(32) min
U⊆X
(rM 1 (U) +rM 2 (U) +|X\U|).
```
```
(Hint:Apply the matroid intersection theorem toM 1 andM 2 ∗.)
(ii) Derive that for eachY⊆X:
(33) max{|Z||Z⊆Y,Z∈I 1 ∨I 2 }=
min
U⊆Y
```
```
(rM 1 (U) +rM 2 (U) +|Y\U|).
```
```
(iii) Derive that (X,I 1 ∨I 2 ) is again a matroid.
(Hint:Use axiom (vi) in Theorem 10.2.)
This matroid is called theunionofM 1 andM 2 , denoted byM 1 ∨M 2. (Edmonds
and Fulkerson [1965], Nash-Williams [1967].)
(iv) LetM 1 = (X,I 1 ),...,Mk= (X,Ik) be matroids and let
```
```
(34) I 1 ∨...∨Ik:={Y 1 ∪...∪Yk|Y 1 ∈I 1 ,...,Yk∈Ik}.
```
```
Derive from (iii) thatM 1 ∨...∨Mk:= (X,I 1 ∨...∨Ik) is again a matroid and
give a formula for its rank function.
```
10.28. (i) LetM= (X,I) be a matroid and letk≥0. Show thatXcan be covered byk
independent sets if and only if|U|≤k·rM(U) for each subsetUofX.
(Hint:Use Exercise 10.27.) (Edmonds [1965b].)
(ii) Show that the problem of finding a minimum number of independent sets cov-
eringXin a given matroidM= (X,I), is solvable in polynomial time.

10.29. LetG= (V,E) be a graph and letk≥0. Show thatEcan be partitioned intok
forests if and only if each nonempty subsetWofV contains at mostk(|W|−1) edges
ofG.
(Hint:Use Exercise 10.28.) (Nash-Williams [1964].)

10.30. LetX 1 ,...,Xmbe subsets ofXand letk≥0.

```
(i) Show thatXcan be partitioned intokpartial transversals of (X 1 ,...,Xm) if
and only if
```
```
(35) k(m−|I|)≥
```
```
∣
∣X\
```
```
⋃
```
```
i∈I
```
```
Xi
```
```
∣
∣
```
```
for each subsetIof{ 1 ,...,m}.
(ii) Derive from (i) that{ 1 ,...,m}can be partitioned into classesI 1 ,...,Ikso that
(Xi|i∈Ij) has a transversal, for eachj= 1,...,kif and only ifY contains at
mostk|Y|of theXias a subset, for eachY ⊆X.
(Hint: Interchange the roles of{ 1 ,...,m}andX.) (Edmonds and Fulkerson
[1965].)
```

```
190 Chapter 10. Matroids
```
10.31. (i) LetM= (X,I) be a matroid and letk≥0. Show that there existkpairwise
disjoint bases ofMif and only ifk(rM(X)−rM(U))≥|X\U|for each subset
UofX.
(Hint:Use Exercise 10.27.) (Edmonds [1965b].)
(ii) Show that the problem of finding a maximum number of pairwise disjoint bases
in a given matroid, is solvable in polynomial time.

10.32. LetG= (V,E) be a connected graph and letk≥0. Show that there existkpairwise
edge-disjoint spanning trees if and only if for eacht, for each partition (V 1 ,...,Vt) of
V intotclasses, there are at leastk(t−1) edges connecting different classes of this
partition.
(Hint:Use Exercise 10.31.) (Nash-Williams [1961], Tutte [1961].)

10.33. LetM 1 andM 2 be matroids so that, fori= 1,2, we can test in polynomial time if a
given set is independent inMi. Show that the same holds for the unionM 1 ∨M 2.

10.34. LetM= (X,I) be a matroid and letB andB′be two disjoint bases. LetB be
partitioned into setsY 1 andY 2. Show that there exists a partition ofB′into setsZ 1
andZ 2 so that bothY 1 ∪Z 1 ∪Z 2 andZ 1 ∪Y 2 are bases ofM.
(Hint: Assume without loss of generality thatX = B∪B′. Apply the matroid
intersection theorem to the matroids (M\Y 1 )/Y 2 and (M∗\Y 1 )/Y 2 .)

10.35. The following is a special case of a theorem of Nash-Williams [1985]:

```
LetG= (V,E) be a simple, connected graph and letb:V →Z+. Call a graph
G ̃= (V , ̃ E ̃) ab-detachmentofGif there is a functionφ:V ̃→V such that|φ−^1 (v)|=
b(v) for eachv∈V, and such that there is a one-to-one functionψ:E ̃ →Ewith
ψ(e) ={φ(v),φ(w)}for each edgee={v,w}ofG ̃.
Then there exists a connectedb-detachment if and only if for eachU⊆V the number
of components of the graph induced byV\Uis at most|EU|−b(U) + 1.
HereEUdenotes the set of edges intersectingU.
```
## 10.6. Weighted matroid intersection

```
We next consider the problem of finding a maximum-weight common independent
set, in two given matroids, with a given weight function. Thealgorithm, again due
to Edmonds [1970], is an extension of the algorithm given in Section 10.5. In each
iteration, instead of finding a pathPwith a minimum number of arcs inH, we will
now requirePto have minimum length with respect to some length function defined
onH.
To describe the algorithm, if matroidM 1 = (S,I 1 ) andM 2 = (S,I 2 ) and a weight
functionw:S→Rare given, call a setY ∈I 1 ∩I 2 extremeifw(Z)≤w(Y) for each
Z∈I 1 ∩I 2 satisfying|Z|=|Y|.
```

Section 10.6. Weighted matroid intersection 191

Weighted common independent set augmenting algorithm

input: matroidsM 1 = (S,I 1 ) andM 2 = (S,I 2 ), a weight functionw:S→Q, and
an extreme common independent setY;
output: an extreme common independent setY′with|Y′|=|Y|+ 1, if it exists
description of the algorithm: Consider again the setsX 1 andX 2 and the directed
graphH(M 1 , M 2 , Y) onSas in the cardinality case.

```
For anyx∈Sdefine the ‘length’l(x) ofxby:
```
(36) l(x) :=w(x) ifx∈Y,
l(x) :=−w(x) ifx6∈Y.

Thelengthof a pathP, denoted byl(P), is equal to the sum of the lengths of the
vertices traversed byP, counting multiplicities.

```
We consider two cases.
```
Case 1.H(M 1 , M 2 , Y)has anX 1 −X 2 pathP.We choosePso thatl(P) is minimal
and so that it has a minimum number of arcs among all minimum-lengthX 1 −X 2
paths. SetY′:=Y△V P.

Case 2. H(M 1 , M 2 , Y)has noX 1 −X 2 path. ThenY is a maximum-size common
independent set.

This finishes the description of the algorithm. The correctness of the algorithm if
Case 2 applies follows directly from Theorem 10.7. In order to show the correctness
if Case 1 applies, we first prove the following basic propertyof the length functionl.

Theorem 10.10. LetC be a directed circuit in H(M 1 , M 2 , Y), and lett ∈ V C.
Define Z := Y△V C. If Z 6∈ I 1 ∩ I 2 then there exists a directed cycle C′ with
V C′⊂V Csuch thatl(C′)< 0 , orl(C′)≤l(C)andt∈V C′.

Proof. By symmetry we can assume thatZ 6∈ I 1. LetN 1 andN 2 be the sets of
arcs inC belonging toH(M 1 , Y) andH(M 2 , Y) respectively. IfZ6∈ I 1 , there is, by
Lemma 10.2 a matchingN 1 ′inH(M 1 , Y) onV CwithN 1 ′ 6 =N 1. Consider the directed
graphD= (V C, A) formed by the arcs inN 1 ,N 1 ′(taking arcs inN 1 ∩N 1 ′ multiple),
and by the arcs inN 2 taking each of them twice (parallel). Now each vertex inV C
is entered and left by exactly two arcs ofD. Moreover, sinceN 1 ′ 6 =N 1 ,Dcontains
a directed circuitC 1 withV C 1 ⊂V C. We can extend this to a decomposition ofA
into directed circuitsC 1 ,... , Ck. Then

(37) χV C^1 +···+χV Ck= 2·χV C.

SinceV C 16 =V Cwe know thatV Cj=V Cfor at most onej. If, sayV Ck=V C,


192 Chapter 10. Matroids

then (37) implies that eitherl(V Cj)<0 for somej < korl(V Cj)≤l(V C) for all
j < k, implying the proposition.
IfV Cj 6 =V Cfor allj, thenl(V Cj)<0 for somej≤korl(V Cj)≤l(V C) for all
j≤k, again implying the proposition.

```
This implies:
```
Theorem 10.11. LetY ∈I 1 ∩I 2. ThenY is extreme if and only ifH(M 1 , M 2 , Y)
has no directed cycle of negative length.

Proof. To see necessity, supposeH(M 1 , M 2 , Y) has a cycle C of negative length.
ChooseCwith|V C|minimal. ConsiderZ:=Y△V C. Sincew(Z) =w(Y)−l(C)>
w(Y), while|Z| =|Y|, we know thatZ 6∈ I 1 ∩I 2. Hence by Proposition 10.10,
H(M 1 , M 2 , Y) has a negative-length directed cycle covering fewer than|V C|vertices,
contradicting our assumption.
To see sufficiency, consider aZ∈ I 1 ∩I 2 with|Z|=|Y|. By Lemma 10.1, both
H(M 1 , Y) andH(M 2 , Y) have a perfect matching onY△Z. These two matchings
together form a disjoint union of a number of directed cyclesC 1 ,... , Ct. Then

(38) w(Y)−w(Z) =

```
∑t
```
```
j=1
```
```
l(Cj)≥ 0 ,
```
implyingw(Z)≤w(Y). SoY is extreme.

This theorem implies that we can find in the algorithm a shortest pathP in
polynomial time (with the Bellman-Ford method).
This also gives:

Theorem 10.12. If Case 1 applies,Y′is an extreme common independent set.

Proof.We first show thatY′∈ I 1 ∩I 2. To this end, lettbe a new element, and
extend (for eachi= 1,2),Mito a matroidMi′= (S+t,I′i), where for eachT⊆S+t:

(39) T∈I′iif and only ifT−t∈Ii.

Note thatH(M 1 ′, M 2 ′, Y +t) arises fromH(M 1 , M 2 , Y) by extending it with a new
vertextand adding arcs from each vertex inX 1 tot, and fromtto each vertex in
X 2.
LetPbe the path found in the algorithm. Define

(40) w(t) :=l(t) :=−l(P).


```
Section 10.6. Weighted matroid intersection 193
```
```
AsPis a shortestX 1 −X 2 path, this makes thatH(M 1 ′, M 2 ′, Y+t) has no negative-
length directed cycle. Hence, by Theorem 10.11,Y+tis an extreme common inde-
pendent set inM 1 ′andM 2 ′.
LetPrun fromz 1 ∈X 1 toz 2 ∈X 2. ExtendP by the arcs (t, z 1 ) and (z 2 , t) to a
directed cycleC. SoZ= (Y+t)△V C. AsPhas a minimum number of arcs among
all shortestX 1 −X 2 paths, and asH(M 1 ′, M 2 ′, Y+t) has no negative-length directed
circuits, by Proposition 10.10 we know thatZ∈I 1 ∩I 2.
Moreover,Zis extreme, sinceY+tis extreme andw(Z) =w(Y+t).
```
```
So the weighted common independent set augmenting algorithm is correct. It
obviously has polynomially bounded running time. Therefore:
```
```
Theorem 10.13. A maximum-weight common independent set in two matroids can
be found in polynomial time.
```
```
Proof. Starting with the extreme common independent set Y 0 := ∅ we can find
iteratively extreme common independent setsY 0 , Y 1 ,... , Yk, where|Yi| =ifori=
0 ,... , kand whereYkis a maximum-size common independent set. Taking one among
Y 0 ,... , Ykof maximum weight, we have an extreme common independent set.
```
```
Exercises
```
10.36. Give an example of two matroidsM 1 = (X,I 1 ) andM 2 = (X,I 2 ) and a weight
functionw:X→Z+so that there is no maximum-weight common independent set
which is also a maximum-cardinality common independent set.

10.37. Reduce the problem of finding a maximum-weight commonbasis in two matroids to
the problem of finding a maximum-weight common independent set.

10.38. LetD = (V,A) be a directed graph, letr∈V, and letl:A→Z+be a length
function. Reduce the problem of finding a minimum-length rooted tree with root
r, to the problem of finding a maximum-weight common independent set in two
matroids.

10.39. LetBbe a common basis of the matroidsM 1 = (X,I 1 ) andM 2 = (X,I 2 ) and let
w:X→Zbe a weight function. Define length functionl:X→Zbyl(x) :=w(x) if
x∈Bandl(x) :=−w(x) ifx6∈B.
Show thatBhas maximum-weight among all common bases ofM 1 andM 2 if and
only ifH(M 1 ,M 2 ,B) has no directed circuit of negative length.


194 Chapter 10. Matroids

## 10.7. Matroids and polyhedra

The algorithmic results obtained in the previous sections have interesting conse-
quences for polyhedra associated with matroids.
LetM= (X,I) be a matroid. Thematroid polytopeP(M) ofMis, by definition,
the convex hull of the incidence vectors of the independent sets ofM. SoP(M) is a
polytope inRX.
Each vectorzinP(M) satisfies the following linear inequalities:

###### (41)

```
z(x) ≥ 0 forx∈X,
z(Y) ≤ rM(Y) forY ⊆X.
```
This follows from the fact that the incidence vectorχY of any independent setY of
Msatisfies (41).

Note that ifzis an integer vector satisfying (41), thenzis the incidence vector of
some independent set ofM.
Edmonds [1970] showed that system (41) in fact fully determines the matroid
polytopeP(M). It means that for each weight function w : X → R, the linear
programming problem

(42) maximize wTz,
subject to z(x) ≥ 0 (x∈X)
z(Y) ≤ rM(Y) (Y ⊆X)

has an integer optimum solutionz. This optimum solution necessarily is the incidence
vector of some independent set ofM. In order to prove this, we also consider the
LP-problem dual to (42):

(43) minimize

###### ∑

```
Y⊆X
```
```
yYrM(Y),
```
```
subject to ∑ yY ≥ 0 (Y ⊆X)
```
```
Y⊆X,x∈Y
```
```
yY ≥ w(x) (x∈X).
```
We show:

Theorem 10.14.Ifwis integer, then(42)and(43)have integer optimum solutions.

Proof.Order the elements ofXasy 1 ,... , ym in such a way thatw(y 1 )≥w(y 2 )≥

... w(ym). Letnbe the largest index for whichw(yn)≥0. DefineXi:={y 1 ,... , yi}
fori= 0,... , mand

(44) Y :={yi|i≤n;rM(Xi)> rM(Xi− 1 )}.


Section 10.7. Matroids and polyhedra 195

ThenY belongs toI(cf. Exercise 10.3). Soz:=χY is an integer feasible solution of
(42).
Moreover, define a vectoryinRP(X)by:

###### (45)

```
yY := w(yi)−w(yi+1) ifY =Xifor somei= 1,... , n− 1 ,
yY := w(yn) ifY =Xn,
yY := 0 for all otherY ⊆X
```
Thenyis an integer feasible solution of (43).
We show thatzandyhave the same objective value, thus proving the theorem:

```
wTz=w(Y) =
```
###### ∑

```
x∈Y
```
```
w(x) =
```
```
∑n
```
```
i=1
```
```
(46) w(yi)·(rM(Xi)−rM(Xi− 1 ))
```
```
=w(yn)·rM(Xn) +
```
```
∑n−^1
```
```
i=1
```
```
(w(yi)−w(yi+1))·rM(Xi) =
```
###### ∑

```
Y⊆X
```
```
yYrM(Y).
```
```
So system (41) is totally dual integral. This directly implies:
```
Corollary 10.14a.The matroid polytopeP(M)is determined by(41).

Proof.Immediately from Theorem 10.14.

An even stronger phenomenon occurs at intersections of matroid polytopes. It
turns out that the intersection of two matroid polytopes gives exactly the convex hull
of the common independent sets, as was shown again by Edmonds[1970].
To see this, we first derive a basic property:

Theorem 10.15. LetM 1 = (X,I 1 )andM 2 = (X,I 2 )be matroids, letw:X→Z
be a weight function and letBbe a common basis of maximum weightw(B). Then
there exist functionsw 1 , w 2 :X→Zso thatw=w 1 +w 2 , and so thatBis both a
maximum-weight basis ofM 1 with respect tow 1 and a maximum-weight basis ofM 2
with respect tow 2.

Proof.Consider the directed graphH(M 1 , M 2 , B) with length functionlas defined
in Exercise 10.39. SinceBis a maximum-weight basis,H(M 1 , M 2 , B) has no directed
circuits of negative length. Hence there exists a functionφ:X→Zso thatφ(y)−
φ(x)≤l(y) for each arc (x, y) ofH(M 1 , M 2 , B). Using the definition ofH(M 1 , M 2 , B)
andl, this implies that fory∈B, x∈X\B:

###### (47)

```
φ(x)−φ(y) ≤ −w(x) if (B\{y})∪{x}∈I 1 ,
φ(y)−φ(x) ≤ w(x) if (B\{y})∪{x}∈I 2.
```

196 Chapter 10. Matroids

Now define

###### (48)

```
w 1 (y) := φ(y), w 2 (y) := w(y)−φ(y) fory∈B
w 1 (x) := w(x) +φ(x), w 2 (x) := −φ(x) forx∈X\B.
```
Thenw 1 (x)≤w 1 (y) whenever (B\{y})∪{x} ∈ I 1. So by Exercise 10.19,Bis a
maximum-weight basis ofM 1 with respect tow 1. Similarly,Bis a maximum-weight
basis ofM 2 with respect tow 2.

Note that ifBis a maximum-weight basis ofM 1 with respect to some weight
functionw, then also after adding a constant function towthis remains the case.
This observation will be used in showing that a theorem similar to Theorem 10.15
holds for independent sets instead of bases.

Theorem 10.16. LetM 1 = (X,I 1 )andM 2 = (X,I 2 )be matroids, letw:X→Z
be a weight function, and letY be a maximum-weight common independent set. Then
there exist weight functionsw 1 , w 2 :X→Zso thatw=w 1 +w 2 and so thatY is both
a maximum-weight independent set ofM 1 with respect tow 1 and a maximum-weight
independent set ofM 2 with respect tow 2.

Proof.LetUbe a set of cardinality|X|+ 2 disjoint fromX. Define

###### (49) J 1 :={Y∪W|Y ∈I 1 , W ⊆U,|Y∪W|≤|X|+ 1},

###### J 2 :={Y∪W|Y ∈I 2 , W ⊆U,|Y∪W|≤|X|+ 1}.

ThenM 1 ′:= (X∪U,J 1 ) andM 2 := (X∪U,J 2 ) are matroids again. Define ̃w:X→Z
by

###### (50)

```
w ̃(x) := w(x) ifx∈X,
w ̃(x) := 0 ifx∈U.
```
LetWbe a subset ofUof cardinality|X\Y|+1. ThenY∪Wis a common basis
ofM 1 ′ andM 2 ′. In fact,Y∪W is a maximum-weight common basis with respect to
the weight function ̃w. (Any basisBof larger weight would intersectXin a common
independent set ofM 1 andM 2 of larger weight thanY.)
So by Theorem 10.15, there exist functions ̃w 1 ,w ̃ 2 :X→Zso that ̃w 1 + ̃w 2 = ̃w
and so thatY∪W is both a maximum-weight basis ofM 1 ′with respect to ̃w 1 and a
maximum-weight basis ofM 2 ′ with respect to ̃w 2.
Now, ̃w 1 (u′′)≤w ̃ 1 (u′) wheneveru′∈W, u′′∈U\W. Otherwise we can replaceu′
inY∪Wbyu′′to obtain a basis ofM 1 ′of larger ̃w 1 -weight. Similarly, ̃w 2 (u′′)≤w ̃ 2 (u′)
wheneveru′∈W, u′′∈U\W.
Since ̃w 1 (u) + ̃w 2 (u) = ̃w(u) = 0 for allu∈U, this implies that ̃w 1 (u′′) = ̃w 1 (u′)
wheneveru′∈W, u′′∈U\W. As∅6=W 6 =U, it follows that ̃w 1 and ̃w 2 are constant


Section 10.7. Matroids and polyhedra 197

onU. Since we can add a constant function to ̃w 1 and subtracting the same function
from ̃w 2 without spoiling the required properties, we may assume that ̃w 1 and ̃w 2 are
0 onU.
Now definew 1 (x) := ̃w 1 (x) andw 2 (x) := ̃w 2 (x) for eachx∈X. ThenY is both a
maximum-weight independent set ofM 1 with respect tow 1 and a maximum-weight
independent set ofM 2 with respect tow 2.

Having this theorem, it is quite easy to derive that the intersection of two matroid
polytopes has integer vertices, being incidence vectors ofcommon independent sets.
By Theorem 10.14 the intersectionP(M 1 )∩P(M 2 ) of the matroid polytopes as-
sociated with the matroidsM 1 = (X,I 1 ) andM 2 = (X,I 2 ) is determined by:

(51) z(x) ≥ 0 (x∈X),
z(Y) ≤ rM 1 (Y) (Y ⊆X),
z(Y) ≤ rM 2 (Y) (Y ⊆X),

The corresponding linear programming problem is, for anyw:X→R:

(52) maximize wTz,
subject to z(x) ≥ 0 (x∈X),
z(Y) ≤ rM 1 (Y) (Y ⊆X),
z(Y) ≤ rM 2 (Y) (Y ⊆X).

Again we consider the dual linear programming problem:

(53) minimize

###### ∑

```
Y⊆X
```
```
(y′YrM 1 (Y) +y′′YrM 2 (Y))
```
```
subject to y′Y ≥ 0 (Y⊆X),
∑ y′′Y ≥^0 (Y⊆X),
```
```
Y⊆X,x∈Y
```
```
(y′Y+yY′′) ≥ w(x) (x∈X).
```
Now

Theorem 10.17.Ifwis integer, then(52)and(53)have integer optimum solutions.

Proof.LetY be a common independent set of maximum weightw(Y). By Theorem
10.15, there exist functionsw 1 , w 2 :X→Zso thatw 1 +w 2 =wand so thatY is a
maximum-weight independent set inMiwith respect towi(i= 1,2).
Applying Theorem 10.14 tow 1 andw 2 , respectively, we know that there exist
integer optimum solutionsy′ andy′′, respectively, for problem (43) with respect to
M 1 , w 1 andM 2 , w 2 , respectively. One easily checks thaty′, y′′forms a feasible solution
of (53). Optimality follows from:


```
198 Chapter 10. Matroids
```
```
(54) w(Z) =w 1 (Z) +w 2 (Z) =
```
###### ∑

```
Y⊆X
```
```
yY′rM 1 (Y) +
```
###### ∑

```
Y⊆X
```
```
yY′′rM 2 (Y)
```
###### =

###### ∑

```
Y⊆X
```
```
(y′YrM 1 (Y) +y′′YrM 2 (Y)).
```
```
So system (51) is totally dual integral. Again, this directlyimplies:
```
```
Corollary 10.17a.The convex hull of the common independent sets of two matroids
M 1 andM 2 is determined by(51).
```
```
Proof.Directly from Theorem 10.17.
```
```
Exercises
```
10.40. Give an example of three matroidsM 1 ,M 2 , andM 3 on the same setXso that the
intersectionP(M 1 )∩P(M 2 )∩P(M 3 ) isnotthe convex hull of the common independent
sets.

10.41. Derive Edmonds’ matroid intersection theorem (Theorem 10.9) from Theorem 10.17.


```
Section 10.7. Matroids and polyhedra 199
```
### References

[1975] G.M. Adel’son-Vel’ski ̆ı, E.A. Dinits, A.V. Karzanov,Potokovye algoritmy[Russian;
Flow Algorithms], Izdatel’stvo “Nauka”, Moscow, 1975.

[1974] A.V. Aho, J.E. Hopcroft, J.D. Ullman,The Design and Analysis of Computer Algo-
rithms, Addison-Wesley, Reading, Massachusetts, 1974.

[1993] R.K. Ahuja, T.L. Magnanti, J.B. Orlin,Network Flows — Theory, Algorithms, and
Applications, Prentice Hall, Englewood Cliffs, New Jersey, 1993.

[1977] K. Appel, W. Haken, Every planar map is four colorablePart I: discharging,Illinois
Journal of Mathematics21 (1977) 429–490.

[1977] K. Appel, W. Haken, J. Koch, Every planar map is four colorable Part II: reducibility,
Illinois Journal of Mathematics21 (1977) 491–567.

[1969] M.L. Balinski, Labelling to obtain a maximum matching, in: Combinatorial Math-
ematics and Its Applications(Proceedings Conference Chapel Hill, North Carolina,
1967; R.C. Bose, T.A. Dowling, eds.), The University of North Carolina Press, Chapel
Hill, North Carolina, 1969, pp. 585–602.

[1957] T.E. Bartlett, An algorithm for the minimum number oftransport units to maintain
a fixed schedule,Naval Research Logistics Quarterly4 (1957) 139–149.

[1986] M. Becker, K. Mehlhorn, Algorithms for routing in planar graphs,Acta Informatica
23 (1986) 163–176.

[1958] R. Bellman, On a routing problem,Quarterly of Applied Mathematics16 (1958) 87–
90.

[1958] C. Berge, Sur le couplage maximum d’un graphe,Comptes Rendus Hebdomadaires
des S ́eances de l’Acad ́emie des Sciences [Paris]247 (1958) 258–259.

[1960] C. Berge, Les probl`emes de coloration en th ́eorie des graphes,Publications de l’Institut
de Statistique de l’Universit ́e de Paris9 (1960) 123–160.

[1961] C. Berge, F ̈arbung von Graphen, deren s ̈amtliche bzw. deren ungerade Kreise starr
sind,Wissenschaftliche Zeitschrift der Martin-Luther-Universit ̈at Halle-Wittenberg,
Mathematisch-Naturwissenschaftliche Reihe10 (1961) 114–115.

[1963] C. Berge, Some classes of perfect graphs, in:Six Papers on Graph Theory[related to
a series of lectures at the Research and Training School of the Indian Statistical Insti-
tute, Calcutta, March-April 1963], Research and Training School, Indian Statistical
Institute, Calcutta, [1963,] pp. 1–21.

[1946] G. Birkhoff, Tres observaciones sobre el algebra lineal,Revista Facultad de Ciencias
Exactas, Puras y Aplicadas Universidad Nacional de Tucuman, Serie A (Matematicas
y Fisica Teorica)5 (1946) 147–151.


```
200 Chapter 10. Matroids
```
```
[1926] O. Bor ̊uvka, O jist ́em probl ́emu minim ́aln ́ım [Czech, with German summary; On a
minimal problem],Pr ́ace Moravsk ́e Pˇr ́ırodovˇedeck ́e Spoleˇcnosti Brno [Acta Societatis
Scientiarum Naturalium Moravi[c]ae]3 (1926) 37–58.
[1941] R.L. Brooks, On colouring the nodes of a network,Proceedings of the Cambridge
Philosophical Society37 (1941) 194–197.
[1911] C. Carath ́eodory, Uber den Variabilit ̈atsbereich der Fourierschen Konstant ̈ en von
positiven harmonischen Funktionen,Rendiconti del Circolo Matematico di Palermo 32
(1911) 193–217 [reprinted in:Constantin Carath ́eodory, Gesammelte Mathematische
Schriften, Band III(H. Tietze, ed.), C.H. Beck’sche Verlagsbuchhandlung, M ̈unchen,
1955, pp. 78–110].
```
```
[1976] N. Christofides,Worst-Case Analysis of a New Heuristic for the Travelling Salesman
Problem, Management Sciences Research Report 388, Graduate Schoolof Industrial
Administration, Carnegie-Mellon University, Pittsburgh, Pennsylvania, 1976.
[1984] R. Cole, A. Siegel, River routing every which way, butloose, in:25th Annual Sympo-
sium on Foundations of Computer Science(25th FOCS, Singer Island, Florida, 1984),
IEEE, New York, 1984, pp. 65–73.
[1971] S.A. Cook, The complexity of theorem-proving procedures, in:Conference Record of
Third Annual ACM Symposium on Theory of Computing(3rd STOC, Shaker Heights,
Ohio, 1971), The Association for Computing Machinery, New York, 1971, pp. 151–
158.
[1978] W.H. Cunningham, A.B. Marsh, III, A primal algorithmfor optimum matching,
[in: Polyhedral Combinatorics — Dedicated to the Memory of D.R. Fulkerson(M.L.
Balinski, A.J. Hoffman, eds.)]Mathematical Programming Study8 (1978) 50–72.
[1951a] G.B. Dantzig, Application of the simplex method to atransportation problem, in:Ac-
tivity Analysis of Production and Allocation — Proceedingsof a Conference(Proceed-
ings Conference on Linear Programming, Chicago, Illinois,1949; Tj.C. Koopmans,
ed.), Wiley, New York, 1951, pp. 359–373.
```
[1951b] G.B. Dantzig, Maximization of a linear function of variables subject to linear in-
equalities, in: Activity Analysis of Production and Allocation — Proceedings of a
Conference(Proceedings Conference on Linear Programming, Chicago, Illinois, 1949;
Tj.C. Koopmans, ed.), Wiley, New York, 1951, pp. 339–347.

```
[1988] D. De Caen, On a theorem of K ̋onig on bipartite graphs,Journal of Combinatorics,
Information & System Sciences13 (1988) 127.
```
```
[1959] E.W. Dijkstra, A note on two problems in connexion with graphs,Numerische Math-
ematik1 (1959) 269–271.
```
```
[1950] R.P. Dilworth, A decomposition theorem for partially ordered sets,Annals of Math-
ematics (2) 51 (1950) 161–166 [reprinted in: The Dilworth Theorems — Selected
Papers of Robert P. Dilworth(K.P. Bogart, R. Freese, J.P.S. Kung, eds.), Birkh ̈auser,
Boston, Massachusetts, 1990, pp. 7–12].
```

```
Section 10.7. Matroids and polyhedra 201
```
```
[1970] E.A. Dinits, Algoritm resheniya zadachi o maksimal’nom potoke v seti so stepenno ̆ı
otsenko ̆ı [Russian],Doklady Akademii Nauk SSSR194 (1970) 754–757 [English trans-
lation: Algorithm for solution of a problem of maximum flow ina network with power
estimationSoviet Mathematics Doklady11 (1970) 1277–1280].
```
```
[1961] G.A. Dirac, On rigid circuit graphs,Abhandlungen aus dem Mathematischen Seminar
der Universit ̈at Hamburg25 (1961) 71–76.
```
[1965a] J. Edmonds, Maximum matching and a polyhedron with 0,1-vertices, Journal of
Research National Bureau of Standards Section B69 (1965) 125–130.

[1965b] J. Edmonds, Minimum partition of a matroid into independent subsets,Journal of
Research National Bureau of Standards Section B69 (1965) 67–72.

```
[1965c] J. Edmonds, Paths, trees, and flowers,Canadian Journal of Mathematics17 (1965)
449–467.
```
```
[1970] J. Edmonds, Submodular functions, matroids, and certain polyhedra, in:Combinato-
rial Structures and Their Applications(Proceedings Calgary International Conference
on Combinatorial Structures and Their Applications, Calgary, Alberta, 1969; R. Guy,
H. Hanani, N. Sauer, J. Sch ̈onheim, eds.), Gordon and Breach, New York, 1970, pp.
69–87.
```
```
[1965] J. Edmonds, D.R. Fulkerson, Transversals and matroid partition,Journal of Research
National Bureau of Standards Section B69 (1965) 147–153.
```
```
[1972] J. Edmonds, R.M. Karp, Theoretical improvements in algorithmic efficiency for net-
work flow problems,Journal of the Association for Computing Machinery19 (1972)
248–264.
```
```
[1931] J. Egerv ́ary, Matrixok kombinatorius tulajdons ́agair ́ol [Hungarian, with German sum-
mary],Matematikai ́es Fizikai Lapok38 (1931) 16–28 [English translation [by H.W.
Kuhn]: On combinatorial properties of matrices, LogisticsPapers, George Washing-
ton University, issue 11 (1955), paper 4, pp. 1–11].
```
```
[1976] S. Even, A. Itai, A. Shamir, On the complexity of timetable and multicommodity
flow problems,SIAM Journal on Computing5 (1976) 691–703.
```
```
[1975] S. Even, O. Kariv, AnO(n^2.^5 ) algorithm for maximum matching in general graphs, in:
16th Annual Symposium on Foundations of Computer Science(16th FOCS, Berkeley,
California, 1975), IEEE, New York, 1975, pp. 100–112.
```
```
[1894] Gy. Farkas, A Fourier-f ́ele mechanikai elv alkalmaz ́asai [Hungarian],Mathematikai
́es Term ́eszettudom ́anyiErtesit ̋o ́ 12 (1894) 457–472 [German translation, with slight
alterations: J. Farkas,Uber die Anwendungen des mechanischen Princips von Fourier ̈ ,
Mathematische und naturwissenschaftliche Berichte aus Ungarn12 (1895) 263–281].
```
```
[1896] Gy. Farkas, A Fourier-f ́ele mechanikai elv alkalmaz ́as ́anak algebrai alapja [Hungarian;
On the algebraic foundation of the applications of the mechanical principle of Fourier],
```

```
202 Chapter 10. Matroids
```
```
Mathematikai ́es Physikai Lapok5 (1896) 49–54 [German translation, with some ad-
ditions: Section I of: J. Farkas, Die algebraischen Grundlagen der Anwendungen des
Fourier’schen Princips in der Mechanik,Mathematische und naturwissenschaftliche
Berichte aus Ungarn15 (1897-99) 25–40].
```
[1898] Gy. Farkas, A Fourier-f ́ele mechanikai elv algebraialapja [Hungarian],Math ́ematikai
́es Term ́eszettudom ́anyiErtesit ̋o ́ 16 (1898) 361–364 [German translation: J. Farkas,
Die algebraische Grundlage der Anwendungen des mechanischen Princips von Fourier,
Mathematische und naturwissenschaftliche Berichte aus Ungarn16 (1898) 154–157].

[1957] G.J. Feeney, The empty boxcar distribution problem,Proceedings of the First Interna-
tional Conference on Operational Research (Oxford 1957)(M. Davies, R.T. Eddison,
T. Page, eds.), Operations Research Society of America, Baltimore, Maryland, 1957,
pp. 250–265.

[1955] A.R. Ferguson, G.B. Dantzig, The problem of routing aircraft, Aeronautical Engi-
neering Review14 (1955) 51–55.

[1956] L.R. Ford, Jr,Network Flow Theory, Paper P-923, The RAND Corporation, Santa
Monica, California, [August 14,] 1956.

[1956] L.R. Ford, Jr, D.R. Fulkerson, Maximal flow through a network,Canadian Journal
of Mathematics8 (1956) 399–404.

[1957] L.R. Ford, Jr, D.R. Fulkerson, A simple algorithm forfinding maximal network flows
and an application to the Hitchcock problem,Canadian Journal of Mathematics 9
(1957) 210–218.

[1958] L.R. Ford, Jr, D.R. Fulkerson, A suggested computation for maximal multi-commodity
network flows,Management Science5 (1958) 97–101.

[1962] L.R. Ford, Jr, D.R. Fulkerson,Flows in Networks, Princeton University Press, Prince-
ton, New Jersey, 1962.

[1980] S. Fortune, J. Hopcroft, J. Wyllie, The directed subgraph homeomorphism problem,
Theoretical Computer Science10 (1980) 111–121.

[1984] M.L. Fredman, R.E. Tarjan, Fibonacci heaps and theiruses in improved network
optimization algorithms, in: 25th Annual Symposium on Foundations of Computer
Science(25th FOCS, Singer Island, Florida, 1984), IEEE, New York, 1984, pp. 338–
346.

[1917] G. Frobenius,Uber zerlegbare Determinanten, ̈ Sitzungsberichte der K ̈oniglich Preuß-
ischen Akademie der Wissenschaften zu Berlin(1917) 274–277 [reprinted in: Fer-
dinand Georg Frobenius, Gesammelte Abhandlungen, Band III (J.-P. Serre, ed.),
Springer, Berlin, 1968, pp. 701–704].

[1973] H.N. Gabow,Implementation of Algorithms for Maximum Matching on Nonbipar-
tite Graphs, Ph.D. Thesis, Department of Computer Science, Stanford University,
Stanford, California, 1973.


```
Section 10.7. Matroids and polyhedra 203
```
[1990] H.N. Gabow, Data structures for weighted matching and nearest common ancestors
with linking, in: Proceedings of the First Annual ACM-SIAM Symposium on Dis-
crete Algorithms(San Francisco, California, 1990), Society for Industrialand Applied
Mathematics, Philadelphia, Pennsylvania, 1990, pp. 434–443.

[1986] Z. Galil, S. Micali, H. Gabow, AnO(EVlogV) algorithm for finding a maximal
weighted matching in general graphs,SIAM Journal on Computing15 (1986) 120–
130.

[1958] T. Gallai, Maximum-minimum S ̈atze ̈uber Graphen,Acta Mathematica Academiae
Scientiarum Hungaricae9 (1958) 395–434.

[1959] T. Gallai,Uber extreme Punkt- und Kantenmengen, ̈ Annales Universitatis Scien-
tiarum Budapestinensis de Rolando E ̈otv ̈os Nominatae, Sectio Mathematica2 (1959)
133–138.

[1979] M.R. Garey, D.S. Johnson,Computers and Intractability — A Guide to the Theory
of NP-Completeness, Freeman, San Francisco, California, 1979.

[1996] G.S. Gasparian, Minimal imperfect graphs: a simple approach,Combinatorica 16
(1996) 209–212.

[1990] A.V. Goldberg,E. Tardos, R.E. Tarjan, Network flow algorithms, in: ́ Paths, Flows,
and VLSI-Layout(B. Korte, L. Lov ́asz, H.J. Pr ̈omel, A. Schrijver, eds.), Springer,
Berlin, 1990, pp. 101–164.

[1988] A.V. Goldberg, R.E. Tarjan, A new approach to the maximum-flow problem,Journal
of the Association for Computing Machinery35 (1988) 921–940.

[1990] A.V. Goldberg, R.E. Tarjan, Finding minimum-cost circulations by successive ap-
proximation,Mathematics of Operations Research15 (1990) 430–466.

[1873] P. Gordan, Ueber die Aufl ̈osung linearer Gleichungenmit reellen Coefficienten,Math-
ematische Annalen6 (1873) 23–28.

[2000] F. G ̈oring, Short proof of Menger’s theorem,Discrete Mathematics219 (2000) 295–
296.

[1981] M. Gr ̈otschel, L. Lov ́asz, A. Schrijver, The ellipsoid method and its consequences in
combinatorial optimization,Combinatorica1 (1981) 169–197 [corrigendum: Combi-
natorica4 (1984) 291–295].

[1960] M.-g. Guan, Graphic programming using odd or even points [in Chinese],Acta Math-
ematica Sinica10 (1960) 263–266 [English translation:Chinese Mathematics1 (1962)
273–277].

[1943] H. Hadwiger,Uber eine Klassifikation der Streckenkomplexe, ̈ Vierteljahrsschrift der
naturforschenden Gesellschaft in Z ̈urich88 (1943) 133–142.


```
204 Chapter 10. Matroids
```
[1958] A. Hajnal, J. Sur ́anyi,Uber die Aufl ̈osung von Graphen in vollst ̈andige Teilgraphe ̈ n,
Annales Universitatis Scientiarum Budapestinensis de Rolando E ̈otv ̈os Nominatae —
Sectio Mathematica1 (1958) 113–121.

[1935] P. Hall, On representatives of subsets,The Journal of the London Mathematical So-
ciety10 (1935) 26–30 [reprinted in: The Collected Works of Philip Hall(K.W. Gru-
enberg, J.E. Roseblade, eds.), Clarendon Press, Oxford, 1988, pp. 165–169].

[1960] A.J. Hoffman, Some recent applications of the theory of linear inequalities to extremal
combinatorial analysis, in:Combinatorial Analysis(New York, 1958; R. Bellman, M.
Hall, Jr, eds.) [Proceedings of Symposia in Applied Mathematics, Volume X], Ameri-
can Mathematical Society, Providence, Rhode Island, 1960,pp. 113–127 [reprinted in:
Selected Papers of Alan Hoffman — With Commentary(C.A. Micchelli, ed.), World
Scientific, Singapore, 2003, pp. 244–248].

[1956] A.J. Hoffman, J.B. Kruskal, Integral boundary pointsof convex polyhedra, in: Lin-
ear Inequalities and Related Systems(H.W. Kuhn, A.W. Tucker, eds.) [Annals of
Mathematics Studies 38], Princeton University Press, Princeton, New Jersey, 1956,
pp. 223–246 [reprinted in: Selected Papers of Alan Hoffman — With Commentary
(C.A. Micchelli, ed.), World Scientific, Singapore, 2003, pp. 220–243].

[1973] J. Hopcroft, R.M. Karp, Ann^5 /^2 algorithm for maximum matchings in bipartite
graphs,SIAM Journal on Computing2 (1973) 225–231.

[1961] T.C. Hu, The maximum capacity route problem,Operations Research9 (1961) 898–
900.

[1963] T.C. Hu, Multi-commodity network flows,Operations Research11 (1963) 344–360.

[1977] D.B. Johnson, Efficient algorithms for shortest pathsin sparse networks,Journal of
the Association for Computing Machinery24 (1977) 1–13.

[1984] N. Karmarkar, A new polynomial-time algorithm for linear programming,Combina-
torica4 (1984) 373–395.

[1972] R.M. Karp, Reducibility among combinatorial problems, in:Complexity of Computer
Computations(Proceedings of a symposium on the Complexity of Computer Com-
putations, IBM Thomas J. Watson Research Center, Yorktown Heights, New York,
1972; R.E. Miller, J.W. Thatcher, eds.), Plenum Press, New York, 1972, pp. 85–103.

[1975] R.M. Karp, On the computational complexity of combinatorial problems,Networks
5 (1975) 45–68.

[1974] A.V. Karzanov, Nakhozhdenie maksimal’nogo potoka vseti metodom predpotokov
[Russian; Determining the maximal flow in a network by the method of preflows],
Doklady Akademii Nauk SSSR215 (1974) 49–52 [English translation:Soviet Mathe-
matics Doklady15 (1974) 434–437].


```
Section 10.7. Matroids and polyhedra 205
```
[1979] L.G. Khachiyan, Polinomialny ̆ı algoritm v line ̆ınom programmirovanii [Russian],Dok-
lady Akademii Nauk SSSR244 (1979) 1093–1096 [English translation: A polynomial
algorithm in linear programming,Soviet Mathematics Doklady20 (1979) 191–194].

[1980] L.G. Khachiyan, Polinomial’nye algoritmy v line ̆ınom programmirovanii [Russian],
Zhurnal Vychislitel’no ̆ı Matematiki i Matematichesko ̆ı Fiziki20 (1980) 51–86 [English
translation: Polynomial algorithms in linear programming,U.S.S.R. Computational
Mathematics and Mathematical Physics20 (1980) 53–72].

[1968] D.E. Knuth,The Art of Computer Programming, Volume I Fundamental Algorithms,
Addison-Wesley, Reading, Massachusetts, 1968.

[1916] D. K ̋onig, Graphok ́es alkalmaz ́asuk a determin ́ansok ́es a halmazok elm ́elet ́ere [Hun-
garian],Mathematikai ́es Term ́eszettudom ́anyiErtesit ̋o ́ 34 (1916) 104–119 [German
translation:Uber Graphen und ihre Anwendung auf Determinantentheorie u ̈ nd Men-
genlehre,Mathematische Annalen77 (1916) 453–465].

[1931] D. K ̋onig, Graphok ́es matrixok [Hungarian; Graphs and matrices],Matematikai ́es
Fizikai Lapok38 (1931) 116–119.

[1932] D. K ̋onig,Uber trennende Knotenpunkte in Graphen (nebst Anwendungen ̈ auf Deter-
minanten und Matrizen),Acta Litterarum ac Scientiarum Regiae Universitatis Hun-
garicae Francisco-Josephinae, Sectio Scientiarum Mathematicarum [Szeged]6 (1932-
34) 155–179.

[1948] Tj.C. Koopmans, Optimum utilization of the transportation system, in:The Econo-
metric Society Meeting(Washington, D.C., 1947; D.H. Leavens, ed.) [Proceedings of
the International Statistical Conferences — Volume V], 1948, pp. 136–146 [reprinted
in:Econometrica17 (Supplement) (1949) 136–146] [reprinted in:Scientific Papers of
Tjalling C. Koopmans, Springer, Berlin, 1970, pp. 184–193].

[1984] M.R. Kramer, J. van Leeuwen, The complexity of wire-routing and finding minimum
area layouts for arbitrary VLSI circuits, in:VLSI-Theory(F.P. Preparata, ed.) [Ad-
vances in Computing Research, Volume 2], JAI Press, Greenwich, Connecticut, 1984,
pp. 129–146.

[1956] J.B. Kruskal, Jr, On the shortest spanning subtree ofa graph and the traveling
salesman problem,Proceedings of the American Mathematical Society7 (1956) 48–
50.

[1955] H.W. Kuhn, The Hungarian method for the assignment problem,Naval Research
Logistics Quarterly2 (1955) 83–97.

[1976] E.L. Lawler,Combinatorial Optimization: Networks and Matroids, Holt, Rinehart
and Winston, New York, 1976.

[1985] C.E. Leiserson, F.M. Maley, Algorithms for routing and testing routability of planar
VLSI layouts, in:Proceedings of the Seventeenth Annual ACM Symposium on Theory
of Computing(17th STOC, Providence, Rhode Island, 1985), The Association for
Computing Machinery, New York, 1985, pp. 69–78.


```
206 Chapter 10. Matroids
```
```
[1972a] L. Lov ́asz, A characterization of perfect graphs,Journal of Combinatorial Theory,
Series B13 (1972) 95–98.
```
[1972b] L. Lov ́asz, Normal hypergraphs and the perfect graph conjecture,Discrete Mathe-
matics2 (1972) 253–267 [reprinted as: Normal hypergraphs and the weak perfect
graph conjecture, in:Topics on Perfect Graphs(C. Berge, V. Chv ́atal, eds.) [Annals
of Discrete Mathematics 21], North-Holland, Amsterdam, 1984, pp. 29–42].

```
[1979] L. Lov ́asz, Graph theory and integer programming, in:Discrete Optimization I(Pro-
ceedings Advanced Research Institute on Discrete Optimization and Systems Appli-
cations and Discrete Optimization Symposium, Banff, Alta, and Vancouver, B.C.,
Canada, 1977; P.L. Hammer, E.L. Johnson, B.H. Korte, eds.) [Annals of Discrete
Mathematics 4], North-Holland, Amsterdam, 1979, pp. 141–158.
```
```
[1986] L. Lov ́asz, M.D. Plummer, Matching Theory, Akad ́emiai Kiad ́o, Budapest [also:
North-Holland Mathematics Studies Volume 121, North-Holland, Amsterdam], 1986.
```
```
[1975] J.F. Lynch, The equivalence of theorem proving and the interconnection problem,
(ACM) SIGDA Newsletter5:3 (1975) 31–36.
```
```
[1978] V.M. Malhotra, M.P. Kumar, S.N. Maheshwari, AnO(|V|^3 ) algorithm for finding
maximum flows in networks,Information Processing Letters7 (1978) 277–278.
```
```
[1985] K. Matsumoto, T. Nishizeki, N. Saito, An efficient algorithm for finding multicom-
modity flows in planar networks,SIAM Journal on Computing14 (1985) 289–302.
```
```
[1927] K. Menger, Zur allgemeinen Kurventheorie,Fundamenta Mathematicae10 (1927)
96–115.
```
```
[1980] S. Micali, V.V. Vazirani, AnO(
```
```
√
|v||E|) algorithm for finding maximum matching
in general graphs, in: 21st Annual Symposium on Foundations of Computer Science
(21st FOCS, Syracuse, New York, 1980), IEEE, New York, 1980,pp. 17–27.
```
```
[1784] G. Monge, M ́emoire sur la th ́eorie des d ́eblais et desremblais,Histoire de l’Acad ́emie
Royale des Sciences[ann ́ee 1781. Avec les M ́emoires de Math ́ematique & de Physique,
pour la mˆeme Ann ́ee] (2e partie) (1784) [Histoire:34–38,M ́emoire:] 666–704.
```
```
[1936] T.S. Motzkin,Beitr ̈age zur Theorie der linearen Ungleichungen, Inaugural Disserta-
tion Basel, Azriel, Jerusalem, 1936 [English translation: Contributions to the theory
of linear inequalities, RAND Corporation Translation 22, The RAND Corporation,
Santa Monica, California, 1952 [reprinted in:Theodore S. Motzkin: Selected Papers
(D. Cantor, B. Gordon, B. Rothschild, eds.), Birkh ̈auser, Boston, Massachusetts,
1983, pp. 1–80]].
```
```
[1961] C.St.J.A. Nash-Williams, Edge-disjoint spanning trees of finite graphs,The Journal
of the London Mathematical Society36 (1961) 445–450.
```
```
[1964] C.St.J.A. Nash-Williams, Decomposition of finite graphs into forests,The Journal of
the London Mathematical Society39 (1964) 12.
```

```
Section 10.7. Matroids and polyhedra 207
```
[1967] C.St.J.A. Nash-Williams, An application of matroids to graph theory, in: Theory
of Graphs — International Symposium — Th ́eorie des graphes —Journ ́ees interna-
tionales d’ ́etude(Rome, 1966; P. Rosenstiehl, ed.), Gordon and Breach, New York,
and Dunod, Paris, 1967, pp. 263–265.

[1985] C.St.J.A. Nash-Williams, Connected detachments ofgraphs and generalized Euler
trails,The Journal of the London Mathematical Society(2) 31 (1985) 17–29.

[1947] J. von Neumann,Discussion of a maximum problem, typescript dated November 15–
16, 1947, Institute for Advanced Study, Princeton, New Jersey, 1947 [reprinted in:
John von Neumann, Collected Works, Volume VI(A.H. Taub, ed.), Pergamon Press,
Oxford, 1963, pp. 89–95].

[1953] J. von Neumann, A certain zero-sum two-person game equivalent to the optimal
assignment problem, in: Contributions to the Theory of Games Volume II (H.W.
Kuhn, A.W. Tucker, eds.) [Annals of Mathematics Studies 28], Princeton University
Press, Princeton, New Jersey, 1953, pp. 5–12 [reprinted in: John von Neumann,
Collected Works, Volume VI(A.H. Taub, ed.), Pergamon Press, Oxford, 1963, pp.
44–49].

[1968] A.R.D. Norman, M.J. Dowling,Railroad Car Inventory: Empty Woodrack Cars on
the Louisville and Nashville Railroad, Technical Report 320-2926, IBM New York
Scientific Center, New York, 1968.

[1981] H. Okamura, P.D. Seymour, Multicommodity flows in planar graphs,Journal of Com-
binatorial Theory, Series B31 (1981) 75–81.

[1988] J.B. Orlin, A faster strongly polynomial minimum cost flow algorithm, in:Proceedings
of the Twentieth Annual ACM Symposium on Theory of Computing(20th STOC,
Chicago, Illinois, 1988), The Association for Computing Machinery, New York, 1988,
pp. 377–387.

[1993] J.B. Orlin, A faster strongly polynomial minimum cost flow algorithm,Operations
Research41 (1993) 338–350.

[1994] C.H. Papadimitriou,Computational Complexity, Addison-Wesley, Reading, Massachusetts,
1994.

[1983] R.Y. Pinter, River routing: methodology and analysis, in: Third CalTech Confer-
ence on Very Large Scale Integration(Pasadena, California, 1983; R. Bryant, ed.),
Springer, Berlin, 1983, pp. 141–163.

[1957] R.C. Prim, Shortest connection networks and some generalizations,The Bell System
Technical Journal36 (1957) 1389–1401.

[1942] R. Rado, A theorem on independence relations,The Quarterly Journal of Mathemat-
ics (Oxford)(2) 13 (1942) 83–89.

[1965] J.W.H.M.T.S.J. van Rees, Een studie omtrent de circulatie van materieel,Spoor- en
Tramwegen38 (1965) 363–367.


```
208 Chapter 10. Matroids
```
[1997] H. Ripphausen-Lipa, D. Wagner, K. Weihe, The vertex-disjoint Menger problem in
planar graphs,SIAM Journal on Computing26 (1997) 331–349.

[1956] J.T. Robacker,Min-Max Theorems on Shortest Chains and Disjunct Cuts of a Net-
work, Research Memorandum RM-1660, The RAND Corporation, SantaMonica,
California, [12 January] 1956.

[1986] N. Robertson, P.D. Seymour, Graph minors. VI. Disjoint paths across a disc,Journal
of Combinatorial Theory, Series B41 (1986) 115–138.

[1995] N. Robertson, P.D. Seymour, Graph minors. XIII. The disjoint paths problem,Jour-
nal of Combinatorial Theory, Series B63 (1995) 65–110.

[1993] N. Robertson, P. Seymour, R. Thomas, Hadwiger’s conjecture forK 6 -free graphs,
Combinatorica13 (1993) 279–361.

[1966] B. Rothschild, A. Whinston, Feasibility of two commodity network flows,Operations
Research14 (1966) 1121–1129.

[1973] M. Sakarovitch, Two commodity network flows and linear programming,Mathemat-
ical Programming4 (1973) 1–20.

[1991] A. Schrijver, Disjoint homotopic paths and trees in aplanar graph,Discrete & Com-
putational Geometry6 (1991) 527–574.

[1994] A. Schrijver, Findingkdisjoint paths in a directed planar graph,SIAM Journal on
Computing23 (1994) 780–788.

[2003] A. Schrijver,Combinatorial Optimization — Polyhedra and Efficiency, Springer, Berlin,
2003.

[1915] E. Stiemke,Uber positive L ̈osungen homogener linearer Gleichungen, ̈ Mathematische
Annalen76 (1915) 340–342.

[1985]E. Tardos, A strongly polynomial minimum cost circulation a ́ lgorithm,Combinatorica
5 (1985) 247–255.

[1974] R. Tarjan, Finding dominators in directed graphs,SIAM Journal on Computing 3
(1974) 62–89.

[1984] R.E. Tarjan, A simple version of Karzanov’s blockingflow algorithm,Operations
Research Letters2 (1984) 265–268.

[1950] R.L. Thorndike, The problem of the classification of personnel, Psychometrika 15
(1950) 215–235.

[1937] A.M. Turing, On computable numbers, with an application to the Entscheidungsprob-
lem,Proceedings of the London Mathematical Society(2) 42 (1937) 230–265 [correc-
tion: 43 (1937) 544–546] [reprinted in:The Undecidable — Basic Papers on Undecid-
able Propositions, Unsolvable Problems and Computable Functions(M. Davis, ed.),
Raven Press, Hewlett, New York, 1965, pp. 116–154].


```
Section 10.7. Matroids and polyhedra 209
```
[1947] W.T. Tutte, The factorization of linear graphs,The Journal of the London Mathemat-
ical Society22 (1947) 107–111 [reprinted in:Selected Papers of W.T. Tutte Volume I
(D. McCarthy, R.G. Stanton, eds.), The Charles Babbage Research Centre, St. Pierre,
Manitoba, 1979, pp.89–97].

[1961] W.T. Tutte, On the problem of decomposing a graph intonconnected factors,The
Journal of the London Mathematical Society36 (1961) 221–230 [reprinted in:Selected
Papers of W.T. Tutte Volume I(D. McCarthy, R.G. Stanton, eds.), The Charles
Babbage Research Centre, St. Pierre, Manitoba, 1979, pp. 214–225].

[1968] A.F. Veinott, Jr, G.B. Dantzig, Integral extreme points, SIAM Review10 (1968)
371–372.

[1964] V.G. Vizing, Ob otsenke khromaticheskogo klassap-grafa [Russian; On an estimate
of the chromatic class of ap-graph],Diskretny ̆ı Analiz3 (1964) 25–30.

[1937] K. Wagner,Uber eine Eigenschaft der ebenen Komplexe, ̈ Mathematische Annalen 114
(1937) 570–590.

[1995] D. Wagner, K. Weihe, A linear-time algorithm for edge-disjoint paths in planar
graphs,Combinatorica15 (1995) 135–150.

[1976] D.J.A. Welsh,Matroid Theory, Academic Press, London, 1976.

[1969] W.W. White, A.M. Bomberault, A network algorithm forempty freight car allocation,
IBM Systems Journal8 (1969) 147–169.


210 Name index

### Name index

```
Adel’son-Vel’ski ̆ı, G.M. 156, 199
Aho, A.V. 98, 110, 199
Ahuja, R.K. 68, 73, 199
Appel, K. 112, 199
```
```
Balinski, M.L. 83, 199
Bartlett, T.E. 76, 199
Becker, M. 168, 199
Bellman, R.E. 13, 16-18, 48, 73, 192, 199
Berge, C. 2, 78-79, 94, 96, 113, 125-126,
129, 199
Birkhoff, G. 44, 199
Bomberault, A.M. 74, 209
Bor ̊uvka, O. 19, 200
Brooks, R.L. 112, 200
```
```
Carath ́eodory, C. 24, 30, 33, 200
Christofides, N. 89-91, 200
Chudnovsky, M. 113, 126
Cole, R.J. 164, 200
Cook, S.A. 98, 105-106, 200
Cunningham, W.H. 94, 96, 200
```
```
Dantzig, G.B. 34, 60, 76, 136, 200, 202,
209
De Caen, D. 41, 200
Dijkstra, E.W. 6, 8-10, 19-21, 48, 200
Dilworth, R.P. 121-124, 127-128, 146,
200
Dinitz, Y. 66, 156, 199, 201
Dirac, G.A. 129, 201
Dowling, M.J. 74, 207
```
```
Edmonds, J.R. 66, 79, 81, 83, 85, 88,
91-94, 96, 184, 187-190, 194-195, 198,
201
Egerv ́ary, J. 47, 52, 201
Euler, L. 166-167
Even, S. 83, 151, 155, 201
```
```
Farkas, Gy. 2, 23, 30-34, 152, 201-202
Feeney, G.J. 74, 202
Ferguson, A.R. 76, 202
Ford, Jr, L.R. 13, 16-18, 48, 59-60, 62,
```
```
73, 149, 169, 172, 192, 202
Fortune, S. 151, 157, 202
Fredman, M.L. 10, 202
Frobenius, F.G. 41, 202
Fulkerson, D.R. 59-60, 62, 73, 149, 169,
172, 189, 201-202
```
```
Gabow, H.N. 88, 202-203
Galil, Z. 88, 203
Gallai, T. 2, 39, 79, 111, 127, 203
Garey, M.R. 98, 203
Gasparyan, G.S. 125, 203
Goldberg, A.V. 68, 203
Gordan, P. 33, 203
G ̈oring, F. 54, 203
Gr ̈otschel, M. 128, 203
Guan, M.-g. 89, 203
```
```
Hadwiger, H. 113, 203
Hajnal, A. 129, 204
Haken, W. 112, 199
Hall, P. 43, 204
Hoffman, A.J. 51, 68-69, 135-137,
145-146, 204
Hopcroft, J.E. 45, 98, 110, 151, 157, 199,
202, 204
Hu, T.C. 21, 150, 153, 156, 204
```
```
Itai, A. 151, 155, 201
```
```
Johnson, D.B. 10, 204
Johnson, D.S. 98, 203
```
```
Kariv, O. 83, 201
Karmarkar, N. 34, 204
Karp, R.M. 45, 66, 98, 106, 151, 201, 204
Karzanov, A.V. 67, 156, 199, 204
Khachiyan, L.G. 34, 205
Knuth, D.E. 67, 151, 205
Koch, J. 112, 199
K ̋onig, D. 2, 41-42, 46, 52-53, 115-117,
120, 123, 126-127, 140, 182-183, 188,
205
Koopmans, Tj.C. 73-74, 205
```

Name index 211

```
Kramer, M.R. 151, 205
Kruskal, Jr, J.B. 20-21, 51, 135-137, 173,
204-205
Kuhn, H.W. 47, 205
Kumar, M.P. 67, 206
```
```
Lawler, E.L. 88, 205
Leeuwen, J. van 151, 205
Leiserson, C.E. 164, 205
Lov ́asz, L. 79, 88, 125-126, 128-129, 203,
206
Lynch, J.F. 151, 206
```
```
Magnanti, T.L. 68, 73, 199
Maheshwari, S.N. 67, 206
Maley, F.M. 164, 205
Malhotra, V.M. 67, 206
Marsh, III, A.B. 94, 96, 200
Matsumoto, K. 168, 206
Mehlhorn, K. 168, 199
Menger, K. 2, 54-55, 58-60, 206
Micali, S. 83, 88, 203, 206
Monge, G. 49, 206
Motzkin, T.S. 33, 206
```
```
Nash-Williams, C.St.J.A. 189-190,
206-207
Neumann, J. von 34, 44, 207
Nishizeki, T. 168, 206
Norman, A.R.D. 74, 207
```
```
Okamura, H. 150, 165-166, 207
Orlin, J.B. 68, 73, 199, 207
```
```
Papadimitriou, C.H. 98, 110, 207
Pinter, R.Y. 163, 207
Plummer, M.D. 88, 206
Prim, R.C. 19-21, 207
```
```
Rado, R. 188, 207
Rees, J.W.H.M.T.S.J. van 76, 207
Ripphausen-Lipa, H. 161, 208
Robacker, J.T. 5, 208
Robertson, G.N. 113, 126, 151, 159, 161,
208
Rothschild, B. 150, 155, 165, 208
```
```
Saito, N. 168, 206
Sakarovitch, M. 153, 208
Schrijver, A. 83, 128, 151, 164, 203, 208
Seymour, P.D. 113, 126, 150-151, 159,
161, 165-166, 207-208
Shamir, A. 151, 155, 201
Siegel, A. 164, 200
Stiemke, E. 33, 208
Sur ́anyi, J. 129, 204
```
```
Tardos,E. 68, 73, 203, 208 ́
Tarjan, R.E. 10, 67-68, 202-203, 208
Thomas, R. 113, 126, 208
Thorndike, R.L. 49, 208
Thue, A. 100
Turing, A.M. 3, 100, 108-110, 208
Tutte, W.T. 2, 78-80, 94, 96, 103, 190,
209
```
```
Ullman, J.D. 98, 110, 199
```
```
Vazirani, V.V. 83, 206
Veinott, Jr, A.F. 136, 209
Vizing, V.G. 116, 209
```
```
Wagner, D. 161, 168, 208-209
Wagner, K. 113, 209
Weihe, K. 161, 168, 208-209
Welsh, D.J.A. 182, 209
Whinston, A. 150, 155, 165, 208
White, W.W. 74, 209
Wyllie, J. 151, 157, 202
```

212 Subject index

### Subject index

```
accepts word
algorithm 101
Turing machine 109
acyclic digraph 157
affine halfspace 24
affine hyperplane 23
airline timetabling 88-89
airplane crew pairing 88
airplane routing 7-8, 56-57, 76, 158
airport terminal assignment 123
algorithm 100 -101
polynomial-time 101
allows sequence of words
algorithm 101
alphabet 98
alternating forest
M- 86
alternating walk
M- 81
antichain 121 -124, 176
arc-disjoint 54
arc-disjoint paths 55
arc-disjoint paths problem 149 -152, 158
arc-disjoints−tpaths 55
arc-disjoints−tpaths/min-max 55
assignment
bungalow 122-123
frequency 114
job 45-46, 48-49, 83-84, 122
platform 123
room 83, 88, 114, 123
seat 83, 88
terminal 123
assignment problem 45-46
optimal 48-50
augmenting path
flow 61
M- 40 -45, 47-48, 82
```
```
b-detachment 190
b-matching 44 , 80 -81
```
```
basic solution 30
basis 178
basis in a matroid 174
basis of a matrix 30
Bellman-Ford method 13 -14
bend cut
1- 168
bipartite matching 41-53, 185
cardinality 41-46
weighted 47-53
bipartite matching algorithm
cardinality 45
weighted 47-48
blocking flow 67 -68
blossom
M- 82
boolean expression 103
box cars
routing empty railway 74
bridge 80
Brooks’ theorem 112
bungalow assignment 122-123
bus station platform assignment 123
```
```
capacity of a cut 58
Carath ́eodory’s theorem 30
cardinality bipartite matching 41-46
cardinality bipartite matching algorithm
45
cardinality common independent set
algorithm 185 -187
cardinality common independent set
augmenting algorithm 185 -187
cardinality common independent set
problem 184-190
cardinality matching 41-46, 78-85, 132
cardinality matroid intersection 184-190
cardinality matroid intersection algorithm
185 -187
cardinality nonbipartite matching 78-85,
132
```

Subject index 213

```
cardinality nonbipartite matching
algorithm 81-83
certificate 97, 101 -103
chain 121 -124
maximal 123
child 9
Chinese postman problem 89 -91
chord 128
chordal graph 128 -131
Christofides’ approximative algorithm for
the traveling salesman problem
89-91
chromatic number 111 -115, 125-128
edge- 116 -117
vertex- 111 -115, 125-128
circuit 178
Hamiltonian 89
circuit basis 182
circulation 68 -70, 144-146
min-cost 73
minimum-cost 73
circulation theorem
Hoffman’s 69 -70, 145-146
class scheduling 117-118
clique 111 -112, 125-128
clique number 111 -112, 125-128
co-NP 102 -103
COCLIQUE 111
cocycle matroid 180
cographic matroid 180 , 182-183
colour 111 , 115
colourable
k- 111
3- 112-115
colouring 111 -115
edge- 115 -117
map 113
vertex- 111 -115
colouring number 111 -115, 125-128
edge- 116 -117
vertex- 111 -115, 125-128
colouring theorem
K ̋onig’s edge- 116 , 120-127
column generation technique 168-172
```
```
commodity 148
commodity flow problem
fractionalk- 148 -152, 168-172
integerk- 148 -151, 155-156
integer undirectedk- 149 -151
k- 148 -152, 168-172
undirectedk- 149 -151
common independent set 184
extreme 190
common independent set algorithm
cardinality 185 -187
weighted 191 -193
common independent set augmenting
algorithm
cardinality 185 -187
weighted 191 -193
common independent set problem
184-193
cardinality 184-190
weighted 190-193
common SDR 43 , 57-58, 70, 120-121,
185, 188
common system of distinct representatives
43 , 57-58, 70, 120-121, 185, 188
common transversal 43 , 57-58, 70,
120-121, 185, 188
comparability graph 124 , 127 -128
complement 125
complementary graph 125
complete
NP- 97-98, 103
component
odd 78
component of a collection of sets 80
cone
convex 29
finitely generated convex 29 -30
conservation law
flow 58
contraction in a matroid 179 -180
convex cone 29
finitely generated 29 -30
convex hull 23
convex set 23 -24
```

214 Subject index

```
Cook’s theorem 105
cost 71
cover
edge 39 -40
vertex 39 -40
cover number
edge 39 -40, 79-80
vertex 39 -40
cover polytope
edge 143
vertex 143
CPM 14-16, 122
crew pairing
airplane 88
Critical Path Method 14-16, 122
cross-free 90
cross-freeness condition 160 -161
Cunningham-Marsh formula 94 -96
cut 5
1-bend 168
s−t 55
s−tvertex- 55
cut condition 149 , 152, 161 , 168
cut/minimum-size
s−t 55
s−tvertex- 55
cut/minimum-size/min-max
s−t 55
s−tvertex- 55
cycle matroid 180
```
```
decomposition theorem
Dilworth’s 121 -122, 124, 127-128,
146
deletion in a matroid 179 -180
dependent set in a matroid 174
deshrinking 85
detachment
b- 190
Dijkstra-Prim method 19-20
Dilworth’s decomposition theorem
121 -122, 124, 127-128, 146
DIRECTED HAMILTONIAN CYCLE
107
```
```
directed Hamiltonian cycle problem 107
disconnecting vertex set
S−T 54
disconnecting vertex
set/minimum-size/min-max
S−T 54-55
disjoint
arc- 54
internally vertex- 54
vertex- 54
disjoint paths
arc- 55
internally vertex- 55
disjoint paths problem
arc- 149 -152, 158
edge- 149 -152, 156-168
vertex- 149 -152, 157-162
disjoints−tpaths
arc- 55
internally 55
internally vertex- 55
disjoints−tpaths/min-max
arc- 55
internally 55
internally vertex- 55
disjointS−T paths/min-max 54-55
disjoint spanning trees problem
edge- 185, 190
disjoint trees problem
vertex- 164 -165
distance 5 - 6
distinct representatives
common system of 43 , 57-58, 70,
120-121, 185, 188
partial system of 43
system of 42 -43, 46, 188
doubly stochastic matrix 44 , 143
down-monotone 176
dual LP-problem 34
dual matroid 178 , 182-183
dual of a matroid 180
duality theorem of linear programming
34 -37
```

Subject index 215

```
dynamic programming 8
```
```
edge-chromatic number 116 -117
edge-colouring 115 -117
edge-colouring number 116 -117
edge-colouring theorem
K ̋onig’s 116 , 120-127
edge cover 39 -40
edge cover number 39 -40, 79-80
edge cover polytope 143
edge cover theorem
K ̋onig’s 42 , 115, 123, 126-127,
140-141
edge-disjoint paths problem 149 -152,
156-168
edge-disjoint spanning trees problem 185,
190
Edmonds’ matching polytope theorem
91 - 93 -94, 96
Edmonds’ matroid intersection theorem
188 , 198
ellipsoid method 34
empty railway box cars
routing 74
end vertex 5
Euler condition 155 , 165 -167
extreme common independent set 190
extreme flow 71
extreme matching 47
```
```
factor
1- 78 -80
factor theorem
Tutte’s 1- 79
Farkas’ lemma 30-32
Fibonacci forest 10 -11
Fibonacci heap 11 -12
finitely generated convex cone 29 -30
flow 144-146
blocking 67 -68
s−t 58
flow algorithm
Ford-Fulkerson maximum 60-68
maximum 60-68
minimum-cost 70 -73
```
```
flow augmenting algorithm 60 -62
flow augmenting path 61
flow conservation law 58
flow problem
fractionalk-commodity 148 -152,
168-172
fractional multicommodity
148 -152, 168-172
integerk-commodity 148 -151,
155-156
integer multicommodity 148 -151,
155-156
integer two-commodity 155-156
integer undirectedk-commodity
149 -151
integer undirected multicommodity
149 -151
k-commodity 148 -152, 168-172
maximum 58 -68
min-cost 70-73
minimum-cost 70-73
multicommodity 148 -152, 168-172
undirectedk-commodity 149 -151
undirected multicommodity
149 -151
flow theorem
integer 60 , 146
follows from word
word 100
Ford-Fulkerson maximum flow algorithm
60-68
forest
Fibonacci 10 -11
M-alternating 86
rooted 9
four-colour conjecture 112
four-colour theorem 112
4CC 112
4CT 112
fractionalk-commodity flow problem
148 -152, 168-172
fractional multicommodity flow problem
148 -152, 168-172
frequency assignment 114
```

216 Subject index

```
Gallai’s theorem 39-40
good characterization 103
good forest 22
goods
storage of 113-114
Gordan’s theorem 33
graphic matroid 180 , 182-183
greedy algorithm 173-176
greedy forest 19
grid graph 168
```
```
Hadwiger’s conjecture 113 , 115
halfspace 24
affine 24
Hall’s marriage theorem 43
Hamiltonian circuit 89
HAMILTONIAN CYCLE
DIRECTED 107
UNDIRECTED 107 -108
Hamiltonian cycle problem
directed 107
undirected 107 -108
heap 9
Fibonacci 11 -12
2- 9 -10
Hoffman-Kruskal theorem 137 -138
Hoffman’s circulation theorem 69 -70,
145-146
hull
convex 23
Hungarian method 47 -48
Hu’s two-commodity flow theorem
153 -155
hyperplane 23
affine 23
```
```
incidence function 91
incidence matrix of a directed graph 143
incidence vector 50 , 91 , 124 , 141 , 169
independent set algorithm
cardinality common 185 -187
weighted common 191 -193
independent set augmenting algorithm
cardinality common 185 -187
```
```
independent set in a matroid 174
independent set problem
cardinality common 184-190
common 184-193
weighted common 190-193
induced subgraph 113
integer flow theorem 60 , 146
integerk-commodity flow problem
148 -151, 155-156
integer linear programming 132-147
integer multicommodity flow problem
148 -151, 155-156
integer polyhedron 133- 134 -138
integer polytope 133
integer two-commodity flow problem
155-156
integer undirectedk-commodity flow
problem 149 -151
integer undirected multicommodity flow
problem 149 -151
integer vector 132
integrity theorem 60 , 62
interior point method 34
internally disjoints−tpaths 55
internally disjoints−tpaths/min-max 55
internally vertex-disjoint 54
internally vertex-disjoint paths 55
internally vertex-disjoints−tpaths 55
internally vertex-disjoints−t
paths/min-max 55
intersection graph 129
interval matrix 146
```
```
job assignment 45-46, 48-49, 83-84, 122
join
T- 91
```
```
k-commodity flow problem 148 -152,
168-172
fractional 148 -152, 168-172
integer 148 -151, 155-156
integer undirected 149 -151
undirected 149 -151
k-truncation of a matroid 179
k-uniform matroid 179
```

Subject index 217

```
knapsack problem 14
K ̋onig’s edge-colouring theorem 116 ,
120-127
K ̋onig’s edge cover theorem 42 , 115, 123,
126-127, 140-141
K ̋onig’s matching theorem 41 -42, 46,
52-53, 115, 127, 140, 188
Kruskal’s method 20
```
```
length of a walk 5
linear matroid 180 -181, 183
linear programming 33-37
duality theorem of 34 -37
integer 132-147
literal 111
Lov ́asz’s perfect graph theorem 125- 126 ,
128
LP 33-37
```
```
M-alternating forest 86
M-alternating walk 81
M-augmenting path 40 -45, 47-48, 82
M-blossom 82
map colouring 113
marriage theorem
Hall’s 43
matching 39 -53, 78-91, 132
b- 44 , 80 -81
bipartite 41-53, 185
cardinality 41-46, 78-85, 132
cardinality bipartite 41-46
cardinality nonbipartite 78-85, 132
nonbipartite 78-91, 132
perfect 39 , 42, 44, 50- 51 , 78 -80
weighted bipartite 47-53
weighted nonbipartite 85-91
matching algorithm
cardinality bipartite 45
weighted bipartite 47-48
matching number 39 -40, 78-79
matching polytope 50-53, 91- 93 -94,
142 -143
perfect 51 , 91 -94, 142
matching polytope theorem
Edmonds’ 91 - 93 -94, 96
```
```
matching problem
weighted 52
matching theorem
K ̋onig’s 41 -42, 46, 52-53, 115, 127,
140, 188
matroid 173 -198
matroid intersection 184-193
cardinality 184-190
weighted 190-193
matroid intersection algorithm
cardinality 185 -187
weighted 191 -193
matroid intersection theorem
Edmonds’ 188 , 198
matroid polytope 194 -198
max-biflow min-cut theorem 156
max-flow min-cut theorem 59 -60, 62,
145-146
maximal chain 123
maximum flow algorithm 60-68
Ford-Fulkerson 60-68
maximum flow problem 58 -68
maximum reliability problem 21
maximum-size matching 78-79
Menger’s theorem 54-56
directed arc-disjoint version of 55
directed internally vertex-disjoint
version of 55
directed vertex-disjoint version of
54 -55
min-cost circulation 73
min-cost flow problem 70-73
minimum-cost circulation 73
minimum-cost flow algorithm 70 -73
minimum-cost flow problem 70-73
minimum-cost transportation problem
73-74
minimum-sizes−tcut 55
minimum-sizes−tcut/min-max 55
minimum-sizeS−T disconnecting vertex
set/min-max 54-55
minimum-sizes−tvertex-cut 55
minimum-sizes−tvertex-cut/min-max
55
```

218 Subject index

```
minimum spanning tree 19-22
minor of a graph 113
minor of a matroid 179
Motzkin’s theorem 33
multicommodity flow problem 148 -152,
168-172
fractional 148 -152, 168-172
integer 148 -151, 155-156
integer undirected 149 -151
undirected 149 -151
```
```
nested family 85
net 148
nonbipartite matching 78-91, 132
cardinality 78-85, 132
weighted 85-91
NP 97-98, 101 -103
co- 102 -103
NP-complete 97-98, 103
```
```
odd component 78
Okamura-Seymour theorem 165 -168
1-bend cut 168
1-factor 78 -80
1-factor theorem
Tutte’s 79
optimal assignment problem 48-50
optimal pairing 88
ordered set
partially 121 -124
```
```
P 97-98, 101
pairing 83
airplane crew 88
optimal 88
parallel elements in a matroid 175
parent 9
partial SDR 43
partial system of distinct representatives
43
partial transversal 43
partially ordered set 121 -124
PARTITION 106 -107
partition matroid 182
partition problem 106 -107
```
```
path 5
M-augmenting 40 -45, 47-48, 82
s−t 5
shortest 5-19, 91
path problem
shortest 5-19
paths
arc-disjoints−t 55
internally disjoints−t 55
internally vertex-disjoint 55
internally vertex-disjoints−t 55
paths/min-max
arc-disjoints−t 55
disjointS−T 54-55
internally disjoints−t 55
internally vertex-disjoints−t 55
perfect graph 125 -128
perfect graph theorem 125- 126 , 128
Lov ́asz’s 125- 126 , 128
strong 113 , 126
perfect matching 39 , 42, 44, 50- 51 , 78 -80
perfect matching polytope 51 , 91 -94, 142
PERT 14-16, 122
PERT-CPM 14-16, 122
planar graph 159-168
platform assignment 123
polyhedron 25 -29
integer 133- 134 -138
polynomial time
Turing machine solves problem in
109
polynomial-time algorithm 101
polytope 25 -29
edge cover 143
integer 133
matching 50-53, 91- 93 -94, 142 -143
matroid 194 -198
perfect matching 51 , 91 -94, 142
stable set 143
vertex cover 143
polytope theorem
Edmonds’ matching 91 - 93 -94, 96
postman problem
Chinese 89 -91
```

Subject index 219

```
primality testing 103
prize equilibrium 16-17
problem 100
processor
two- 84
processor scheduling
two- 83-84
Program Evaluation and Review
Technique 14-16, 122
project scheduling 122
```
```
railway box cars
routing empty 74
railway platform assignment 123
railway stock routing 74-76, 151-152
rank 178
rank function 178
rank of a matroid 174
reliability problem
maximum 21
representatives
common system of distinct 43 ,
57-58, 70, 120-121, 185, 188
partial system of distinct 43
system of distinct 42 -43, 46, 188
restriction in a matroid 179
rigid circuit graph 128 -131
room assignment 83, 88, 114, 123
root 5 , 9
rooted forest 9
rooted tree 5 , 9 , 185, 193
routing
airplane 7-8, 56-57, 76, 158
railway stock 74-76, 151-152
ship 7-8, 73-74
vehicle 7-8
VLSI- 151, 162-164
routing empty freighters 73-74
routing empty railway box cars 74
```
```
s−tcut/minimum-size 55
s−tcut/minimum-size/min-max 55
S−Tdisconnecting vertex set 54
S−Tdisconnecting vertex
set/minimum-size/min-max 54-55
```
```
S−Tpath 54
s−tpaths
arc-disjoint 55
internally disjoint 55
internally vertex-disjoint 55
S−Tpaths/min-max
disjoint 54-55
s−tpaths/min-max
arc-disjoint 55
internally disjoint 55
internally vertex-disjoint 55
s−tvertex-cut 55
s−tvertex-cut/minimum-size 55
s−tvertex-cut/minimum-size/min-max
55
salesman problem
Christofides’ approximative
algorithm for the traveling
89-91
traveling 89-90, 108
salesman tour
traveling 89
SAT 103 -105
3- 106
satisfiability problem 103 -105
3- 106
scheduling
class 117-118
project 122
two-processor 83-84
SDR 42 -43, 46, 188
common 43 , 57-58, 70, 120-121,
185, 188
partial 43
seat assignment 83, 88
separate 23
separates pair
curve 161
ship routing 7-8, 73-74
shortest path 5-19, 91
shortest path problem 5-19
shrinking 81
simplex method 34
simplicial vertex 129
```

220 Subject index

```
sink 157
size of a word 99
solves problem
algorithm 101
Turing machine 109
solves problem in polynomial time
Turing machine 109
source 157
spanning tree
minimum 19-22
spanning trees problem
edge-disjoint 185, 190
stable set 39 -40, 125-128
stable set number 39 -40, 111-112, 125-128
stable set polytope 143
starting vertex 5
Stiemke’s theorem 33
stops at word
algorithm 101
storage of goods 113-114
strong perfect graph theorem 113 , 126
subgraph
induced 113
subject to capacity
flow 58
subtrees of a tree 129-131
system of distinct representatives 42 -43,
46, 188
common 43 , 57-58, 70, 120-121,
185, 188
partial 43
```
```
T-join 91
terminal assignment 123
3-SAT 106
3-satisfiability problem 106
Thue system 100-101
tight subset 166
timetabling
airline 88-89
totally unimodular matrix 134 -147
tour
traveling salesman 89
transportation problem 49-50, 63, 65
```
```
minimum-cost 73-74
transversal 42 -43, 46, 188
common 43 , 57-58, 70, 120-121,
185, 188
partial 43
transversal matroid 181 -182
traveling salesman problem 89-90, 108
Christofides’ approximative
algorithm for the 89-91
traveling salesman tour 89
tree
minimum spanning 19-22
rooted 5 , 9 , 185, 193
trees problem
edge-disjoint spanning 185, 190
vertex-disjoint 164 -165
triangulated graph 128 -131
truncation of a matroid 179
k- 179
TSP 108
Turing machine 100, 108 -110
Tutte-Berge formula 78 -79, 96
Tutte’s 1-factor theorem 79
two-commodity flow problem
integer 155-156
two-commodity flow theorem
Hu’s 153 -155
2-heap 9 -10
two-processor 84
two-processor scheduling 83-84
```
```
under capacity
flow 58
UNDIRECTED HAMILTONIAN CYCLE
107 -108
undirected Hamiltonian cycle problem
107 -108
undirectedk-commodity flow problem
149 -151
integer 149 -151
undirected multicommodity flow problem
149 -151
integer 149 -151
uniform matroid 179
```

Subject index 221

```
k- 179
unimodular matrix 136 -137
union of matroids 189
```
```
value of a flow 58
vehicle routing 7-8
vertex-chromatic number 111 -115,
125-128
VERTEX-COLOURING 111 -112
vertex-colouring 111 -115
vertex-colouring number 111 -115,
125-128
vertex cover 39 -40
vertex cover number 39 -40
vertex-cover number 111
vertex cover polytope 143
vertex-cut
s−t 55
vertex-cut/minimum-size
s−t 55
vertex-cut/minimum-size/min-max
s−t 55
vertex-disjoint 54
internally 54
vertex-disjoint paths
internally 55
vertex-disjoint paths problem 149 -152,
157-162
vertex-disjoints−tpaths
internally 55
vertex-disjoints−tpaths/min-max
internally 55
vertex-disjoint trees problem 164 -165
vertex of a convex set 25
Vizing’s theorem 116 -117
VLSI-routing 151, 162-164
```
```
W−vwalk 82
walk 5
M-alternating 81
s−t 5
W−v 82
weighted bipartite matching 47-53
weighted bipartite matching algorithm
47-48
```
```
weighted bipartite matching problem 77
weighted common independent set
algorithm 191 -193
weighted common independent set
augmenting algorithm 191 -193
weighted common independent set
problem 190-193
weighted matching 47-53, 85-91
weighted matching problem 52
weighted matroid intersection 190-193
weighted matroid intersection algorithm
191 -193
weighted nonbipartite matching 85-91
word 99
```

