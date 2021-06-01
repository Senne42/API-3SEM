package com.grupo2.API_TraceFinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

import com.grupo2.API_TraceFinder.classes.Codelist;
import com.grupo2.API_TraceFinder.classes.RelacaoBlocoTraco;

@Repository
public interface RelacaoBlocoTracoRepository extends JpaRepository<RelacaoBlocoTraco, Long> {
  @Modifying
  @Transactional
  @Query(value = "DELETE FROM relacao_bloco_traco WHERE bloco_id = ?1 AND traco_id = ?2 ", nativeQuery = true)
  void DeleteTracosDoc(Long blocoid, Long tracoid);
}
